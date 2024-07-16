ALTER TABLE comments ADD CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE likes ADD CONSTRAINT fk_post_id_likes FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE likes ADD CONSTRAINT fk_comment_id FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE;
ALTER TABLE dislikes ADD CONSTRAINT fk_post_id_dislikes FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE dislikes ADD CONSTRAINT fk_comment_id_dislikes FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE;