package com.IntuitCraft.demo.service;

import com.IntuitCraft.demo.Entities.Post;
import com.IntuitCraft.demo.repositories.IPostRepository;
import org.jdbi.v3.core.Jdbi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public class PostRepositoryImpl implements IPostRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final Jdbi jdbi;

    public PostRepositoryImpl(@Value("${spring.datasource.url}")
                              String URL,@Value("${spring.datasource.password}")
                              String PASSWORD,@Value("${spring.datasource.username}")
                              String USERNAME) {
        this.jdbi = Jdbi.create(URL,USERNAME,PASSWORD);
    }

    @Override
    public void save(Post post) {
        String sql = "INSERT INTO posts (title, content,user_id, date_added) VALUES (:title, :content,:userId, :date_added)";

        long postId = jdbi.withHandle(handle ->
                handle.createUpdate(sql)
                        .bind("title", post.getTitle())
                        .bind("content", post.getContent())
                        .bind("userId",post.getUserId())
                        .bind("date_added",new Date())
                        .executeAndReturnGeneratedKeys("id")
                        .mapTo(Long.class)
                        .one()
        );
    }

    @Override
    public Post findPostById(Long postId) {
        return jdbi.withHandle(handle ->
                handle.createQuery("SELECT * FROM posts WHERE id = :id")
                        .bind("id", postId)
                        .mapToBean(Post.class)
                        .findFirst().orElse(null)
        );
    }

    @Override
    public Page<Post> getPostByDateAdded(LocalDate date, Pageable pageable) {
        String sql = "SELECT * FROM posts WHERE date_added::date = :date ORDER BY date_added desc LIMIT :limit OFFSET :offset";

        List<Post> posts = jdbi.withHandle(handle -> handle.createQuery(sql)
                .bind("date", date)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .mapToBean(Post.class)
                .list());

        // Count total number of posts
        long totalCount = jdbi.withHandle(handle -> handle.createQuery("SELECT COUNT(*) FROM posts WHERE date_added = :date")
                .bind("date", date)
                .mapTo(Long.class)
                .one());

        return new PageImpl<>(posts, pageable, totalCount);
    }

    @Override
    public void delete(Post post) {
        String sql = "DELETE FROM posts where id = :postId";
        jdbi.withHandle(handle ->
                handle.createUpdate(sql)
                        .bind("postId", post.getId())
                        .execute()
        );
    }


}

