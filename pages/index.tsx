//libs
import type { NextPage } from "next";
import Head from "next/head";

//components
import { Post } from "@/components/Post";

//utils
import { sanityClient, urlFor } from "@/sanity";

//types
import { Post as PostType } from "@/types";

type Props = {
	posts: PostType[];
};

const Home: NextPage<Props> = (props) => {
	const { posts } = props;

	console.log(posts);

	return (
		<div className='max-w-7xl mx-auto'>
			<Head>
				<title>Medium Blog</title>
				<meta name='description' content='Blogs Site' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-5'>
				<div className='px-10 space-y-5'>
					<h1 className='text-6xl max-w-xl font-serif'>
						<span className='underline decoration-black decoration-4'>
							Medium
						</span>{" "}
						is a place to write, read and connect
					</h1>

					<h2>
						It&apos;s easy and free to post your thinking on any topic and
						connect with millions of readers
					</h2>
				</div>

				<img
					className='hidden md:inline-flex h-32 lg:h-56 px-10'
					src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Medium_icon.svg/1280px-Medium_icon.svg.png'
					alt=''
				/>
			</div>

			{/* Posts */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
				{posts.map((post) => (
					<Post key={post._id} post={post} />
				))}
			</div>
		</div>
	);
};

export const getServerSideProps = async () => {
	const query = `
		*[_type == 'post']{
			_id,
			title,
			slug,
			mainImage,
			description,
			author -> {
			name,
			image
			}
		}
  `;

	const posts = await sanityClient.fetch(query);

	return {
		props: {
			posts,
		},
	};
};

export default Home;
