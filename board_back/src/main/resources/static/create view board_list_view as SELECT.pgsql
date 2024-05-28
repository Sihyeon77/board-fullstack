create view board_list_view as SELECT
B.id as board_number,
B.title as title,
B.content as content,
I.image as title_image,
B.viewcount as view_count,
B.favoritecount as favorite_count,
B.commentcount as comment_count,
B.writtendatetime as written_datetime,
U.email as writer_email,
U.nickname as writer_nickname,
U.profile_img as writer_profile_image
from board as B
inner JOIN pageuser as U
on B.writer_email = U.email
left JOIN (
    SELECT board_id, any_value(image) as image from image GROUP by board_id
) as I 
on B.id = I.board_id;