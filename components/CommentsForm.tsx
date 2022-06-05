//libs
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type IFormInput = {
	_id: string;
	name: string;
	email: string;
	comment: string;
};

type Props = {
	postId: string;
	setSubmitted: (isSubmitted: boolean) => void;
};

const CommentsForm = (props: Props): JSX.Element => {
	const { postId, setSubmitted } = props;

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
				value={postId}
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
					<span className='text-red-500'>The Comment Field is required</span>
				) : null}
				{errors.email ? (
					<span className='text-red-500'>The Email Field is required</span>
				) : null}
			</div>

			<input
				type='submit'
				className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:shadow-none text-white font-bold py-2 px-4 rounded cursor-pointer'
			/>
		</form>
	);
};

const MemoizedCommentsForm = React.memo(CommentsForm);

export { MemoizedCommentsForm as CommentsForm };
