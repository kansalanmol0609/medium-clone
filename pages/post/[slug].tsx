//libs
import React from "react";
import type { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

//utils
import { sanityClient, urlFor } from "@/sanity";

//types
import { Comment, Post } from "@/types";
import Head from "next/head";

type IFormInput = {
	_id: string;
	name: string;
	email: string;
	comment: string;
};

type Props = {
	post: Post;
};

const Post = (props: Props) => {
	const { post } = props;

	const [submitted, setSubmitted] = React.useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormInput>();

	const onSubmit: SubmitHandler<IFormInput> = React.useCallback((data) => {
		fetch("/api/createComment", {
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(() => {
				console.log(data);
				setSubmitted(true);
			})
			.catch((err) => {
				console.log(err);
				setSubmitted(false);
			});
	}, []);

	return (
		<>
			<Head>
				<title>Medium - {post.title}</title>
			</Head>
			<main>
				<img
					className='w-full h-40 object-cover'
					src={urlFor(post.mainImage).url()!}
					alt=''
				/>

				<article className='max-w-3xl mx-auto p-5'>
					<h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
					<h2 className='text-xl font-light text-gray-500 mb-2'>
						{post.description}
					</h2>

					<div className='flex items-center space-x-2'>
						<img
							className='h-10 w-10 rounded-full'
							src={urlFor(post.author.image).url()!}
							alt=''
						/>

						<p className='font-extralight text-sm'>
							Blog post by{" "}
							<span className='text-green-500'>{post.author.name}</span> -
							Published at {new Date(post._createdAt).toLocaleDateString()}
						</p>
					</div>

					<div className='mt-10'>
						<PortableText
							dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
							projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
							content={post.body}
							serializers={{
								h1: (props: any) => (
									<h1 className='text-2xl font-bold my-5' {...props} />
								),
								h2: (props: any) => (
									<h2 className='text-xl font-bold my-5' {...props} />
								),
								h3: (props: any) => (
									<h3 className='text-md font-bold my-5' {...props} />
								),
								li: ({ children }: any) => (
									<li className='ml-4 list-desc'>{children}</li>
								),
								p: (props: any) => <p className='my-4' {...props} />,
								div: (props: any) => <div className='my-4' {...props} />,
								link: ({ href, children }: any) => (
									<a href={href} className='text-blue-500 hover:underline'>
										{children}
									</a>
								),
							}}
						/>
					</div>
				</article>

				<hr className='max-w-lg my-5 mx-auto border border-yellow-500' />

				{submitted ? (
					<div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto rounded'>
						<h3 className='text-3xl font-bold'>
							Thank you for submitting your comment!
						</h3>
						<p>Once, it has been approved, it will appear below!</p>
					</div>
				) : (
					<form
						className='flex flex-col p-5 max-w-2xl mx-auto mb-10'
						onSubmit={handleSubmit(onSubmit)}
					>
						<h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
						<h4 className='text-3xl font-bold'>Leave a comment below!</h4>
						<hr className='py-3 mt-2' />

						<input
							{...register("_id", { required: true })}
							type='hidden'
							name='_id'
							value={post._id}
						/>

						<label className='block mb-5'>
							<span className='text-gray-700'>Name</span>
							<input
								{...register("name", { required: true })}
								className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring'
								placeholder=''
								type='text'
							/>
						</label>
						<label className='block mb-5'>
							<span className='text-gray-700'>Email</span>
							<input
								{...register("email", { required: true })}
								className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring'
								placeholder=''
								type='email'
							/>
						</label>
						<label className='block mb-5'>
							<span className='text-gray-700'>Comment</span>
							<textarea
								{...register("comment", { required: true })}
								className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring'
								placeholder=''
								rows={8}
							/>
						</label>

						{/* Errors */}
						<div className='flex flex-col p-5'>
							{errors.name ? (
								<span className='text-red-500'>The Name Field is required</span>
							) : null}
							{errors.comment ? (
								<span className='text-red-500'>
									The Comment Field is required
								</span>
							) : null}
							{errors.email ? (
								<span className='text-red-500'>
									The Email Field is required
								</span>
							) : null}
						</div>

						<input
							type='submit'
							className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:shadow-none text-white font-bold py-2 px-4 rounded cursor-pointer'
						/>
					</form>
				)}

				{/* Comments */}
				<div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
					<h3 className='text-4xl'>{post.comments.length} Comments</h3>
					<hr className='pb-2' />

					{post.comments.map((comment: Comment) => (
						<div key={comment._id}>
							<p>
								<span className='text-yellow-500'>{comment.name}: </span>
								{comment.comment}
							</p>
						</div>
					))}
				</div>
			</main>
		</>
	);
};

export default Post;

export const getStaticPaths = async () => {
	const query = `
    *[_type == 'post']{
        _id,
        slug {
            current
        }
    }
    `;

	const posts = await sanityClient.fetch(query);

	const paths = posts.map((post: Post) => ({
		params: {
			slug: post.slug.current,
		},
	}));

	return {
		paths,
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const query = `
    *[_type == 'post' && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image
        },
        'comments': *[
            _type == 'comment' &&
            post._ref == ^._id &&
            approved == true
        ],
        description,
        mainImage,
        slug,
        body
    }
    `;

	const post = await sanityClient.fetch(query, {
		slug: params?.slug,
	});

	if (!post) {
		return {
			//with fallback: 'blocking', nextJs will throw 404 page
			notFound: true,
		};
	}

	return {
		props: {
			post,
		},
		revalidate: 60, //every 60 seconds, it will update the old cached version
	};
};
