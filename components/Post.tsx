//libs
import React from "react";
import Link from "next/link";

//utils
import { urlFor } from "@/sanity";

//types
import { Post } from "@/types";

type Props = {
	post: Post;
};

const Post = (props: Props): JSX.Element => {
	const { post } = props;

	return (
		<Link href={`/post/${post.slug.current}`}>
			<div className='border rounded-lg overflow-hidden group cursor-pointer'>
				<img
					className='h-60 w-full group-hover:scale-105 transition-transform duration-200 ease-in-out'
					src={urlFor(post.mainImage).url()}
					alt=''
				/>
				<div className='flex justify-between p-5 bg-white'>
					<div>
						<p className='text-lg font-bold'>{post.title}</p>
						<p className='text-xs'>
							{post.description} by {post.author.name}
						</p>
					</div>

					<img
						className='h-12 w-12 rounded-full'
						src={urlFor(post.author.image).url()}
						alt=''
					/>
				</div>
			</div>
		</Link>
	);
};

const MemoizedPost = React.memo(Post);

export { MemoizedPost as Post };
