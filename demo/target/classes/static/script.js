$(document).ready(function() {
    // Fetch posts data from the server
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let formattedDate = `${year}-${month}-${day}`;
    formattedDate = "2024-07-09";
    $.ajax({
        url: `http://localhost:9099/api/posts?date=${formattedDate}&pageNumber=1`,
        method: 'GET',
        success: function(posts) {
            renderPosts(posts);
        },
        error: function(err) {
            console.error('Error fetching posts:', err);
        }
    });

    // Function to render posts
    function renderPosts(posts) {
        var postsContainer = $('#postsContainer');
        postsContainer.empty();

        posts.response.content.forEach(function(post) {
            var postHtml = `
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.content}</p>
          </div>
          <div id="commentsSection-${post.id}" class="card-footer">
            <!-- Comments will be dynamically added here -->
          </div>
          <div class="card-footer">
            <form id="commentForm-${post.id}">
              <div class="form-group">
                <label for="commentText-${post.id}">Add a Comment:</label>
                <textarea class="form-control" id="commentText-${post.id}" rows="3" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Post Comment</button>
            </form>
          </div>
        </div>
      `;

            postsContainer.append(postHtml);

            // Fetch comments for this post
            fetchAndRenderComments(post.id);
        });
    }

    // Function to fetch and render comments for a specific post
    function fetchAndRenderComments(postId) {
        $.ajax({
            url: `http://localhost:9099/api/post/${postId}/comment?pageNumber=0`,
            method: 'GET',
            success: function(comments) {
                renderComments(postId, comments);
            },
            error: function(err) {
                console.error(`Error fetching comments for post ${postId}:`, err);
            }
        });
    }

    // Function to render comments for a specific post
    function renderComments(postId, comments) {
        var commentsSection = $(`#commentsSection-${postId}`);
        commentsSection.empty();

        comments.response.content.forEach(function(comment) {
            var commentHtml = `
        <div class="card mt-2">
          <div class="card-body">
            <p class="card-text">${comment.content}</p>
            <button class="btn btn-outline-primary mr-2" onclick="likeComment(${postId}, ${comment.id}, '${comment.userId}')">Like <span id="likeCount-${comment.id}">${comment.likesCount}</span></button>
            <button class="btn btn-outline-danger" onclick="dislikeComment(${postId}, ${comment.id}, '${comment.userId}')">Dislike <span id="dislikeCount-${comment.id}">${comment.dislikesCount}</span></button>
          </div>
        </div>
      `;

            commentsSection.append(commentHtml);
        });
    }

    // Handle submitting a new comment for a specific post
    $(document).on('submit', '[id^="commentForm-"]', function(event) {
        event.preventDefault();
        var postId = $(this).attr('id').split('-')[1];
        var commentText = $(`#commentText-${postId}`).val().trim();
        if (commentText !== '') {
            var newComment = {
                postId: postId,
                text: commentText
            };

            // Send the new comment to the server
            $.ajax({
                url: `https://your-api-url/posts/${postId}/comments`, // Replace with your actual API endpoint to add a comment for a specific post
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newComment),
                success: function(response) {
                    console.log('Comment added successfully:', response);
                    // Refresh comments after adding new comment
                    fetchAndRenderComments(postId);
                    $(`#commentText-${postId}`).val('');
                },
                error: function(err) {
                    console.error('Error adding comment:', err);
                }
            });
        }
    });

    // Function to handle liking a post
    window.likePost = function(postId) {
        $.ajax({
            url: `https://your-api-url/posts/${postId}/like`, // Replace with your actual API endpoint to like a post
            method: 'PUT',
            success: function(response) {
                console.log('Post liked successfully:', response);
                fetchAndRenderComments(postId); // Refresh comments after liking post
            },
            error: function(err) {
                console.error('Error liking post:', err);
            }
        });
    };

    // Function to handle disliking a post
    window.dislikePost = function(postId) {
        $.ajax({
            url: `https://your-api-url/posts/${postId}/dislike`, // Replace with your actual API endpoint to dislike a post
            method: 'PUT',
            success: function(response) {
                console.log('Post disliked successfully:', response);
                fetchAndRenderComments(postId); // Refresh comments after disliking post
            },
            error: function(err) {
                console.error('Error disliking post:', err);
            }
        });
    };

    // Function to handle liking a comment
    window.likeComment = function(postId, commentId, userId) {
        $.ajax({
            url: `http://localhost:9099/api/vote/${commentId}/true`,
            data:  userId,
            method: 'PUT',
            success: function(response) {
                //console.log('Comment liked successfully:', response);
                fetchAndRenderComments(postId); // Refresh comments after liking comment
            },
            error: function(err) {
                console.error('Error liking comment:', err);
            }
        });
    };

    // Function to handle disliking a comment
    window.dislikeComment = function(postId, commentId, userId) {
        $.ajax({
            url: `http://localhost:9099/api/vote/${commentId}/false`,
            data: userId,
            method: 'PUT',
            success: function(response) {
                //console.log('Comment disliked successfully:', response);
                fetchAndRenderComments(postId); // Refresh comments after disliking comment
            },
            error: function(err) {
                console.error('Error disliking comment:', err);
            }
        });
    };
});
