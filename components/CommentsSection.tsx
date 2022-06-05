//libs
import React from "react";

//types
import { Comment } from "@/types";

type Props = {
	comments: Comment[];
};

const CommentsSection = (props: Props): JSX.Element => {
	const { comments } = props;

	return (
		<div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
			<h3 className='text-4xl'>{comments.length} Comments</h3>
			<hr className='pb-2' />

			{comments.map((comment: Comment) => (
				<div key={comment._id}>
					<p>
						<span className='text-yellow-500'>{comment.name}: </span>
						{comment.comment}
					</p>
				</div>
			))}
		</div>
	);
};

const MemoizedCommentsSection = React.memo(CommentsSection);

export { MemoizedCommentsSection as CommentsSection };
