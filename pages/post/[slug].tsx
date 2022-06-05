//libs
import React from "react";
import type { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import Head from "next/head";
import Image from "next/image";

//utils
import { sanityClient, urlFor } from "@/sanity";
import { getImageDimensions } from "@sanity/asset-utils";

//components
import { CommentsForm } from "@/components/CommentsForm";
import { CommentsSection } from "@/components/CommentsSection";

//types
import { Post } from "@/types";

const AUTHOR_IMAGE_SIZE = "40";

type Props = {
	post: Post;
};

const Post = (props: Props) => {
	const { post } = props;

	const [submitted, setSubmitted] = React.useState(false);

	return (
		<>
			<Head>
				<title>Medium - {post.title}</title>
			</Head>
			<main>
				<div className='w-full h-44 relative'>
					<Image
						className='object-cover'
						layout='fill'
						src={urlFor(post.mainImage).url()!}
						alt=''
					/>
				</div>

				<article className='max-w-3xl mx-auto p-5'>
					<h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
					<h2 className='text-xl font-light text-gray-500 mb-2'>
						{post.description}
					</h2>

					<div className='flex items-center space-x-2'>
						<Image
							width={AUTHOR_IMAGE_SIZE}
							height={AUTHOR_IMAGE_SIZE}
							className='rounded-full'
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
								image: ({ asset, ...props }: any) => {
									const { height, width, aspectRatio } =
										getImageDimensions(asset);

									return (
										<div
											className='relative mx-auto'
											style={{
												height: `${height}px`,
												width: `${width}px`,
												maxWidth: "100%",
											}}
										>
											<Image
												layout='fill'
												src={urlFor(asset).url()!}
												alt='image'
												{...props}
											/>
										</div>
									);
								},
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
					<CommentsForm postId={post._id} setSubmitted={setSubmitted} />
				)}

				{/* Comments */}
				<CommentsSection comments={post.comments} />
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
