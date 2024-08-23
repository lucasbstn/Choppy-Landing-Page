<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { removeUselessText } from '$lib/utils';
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	let loadingUser = true;
	let awaitingOTP = false;
	let disableSubmit = false;
	let disableSignInWithEmail = false;
	let email = '';
	let otp = '';
	let flights = '';

	window.addEventListener('message', async (event) => {
		const access_token = event.data?.access_token;
		const refresh_token = event.data?.refresh_token;

		if (access_token && refresh_token) {
			await supabase.auth.setSession({
				access_token,
				refresh_token
			});
		}
	});

	const validateEmail = (email: string) => {
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
	};

	const signInWithEmail = async () => {
		if (!validateEmail(email)) {
			toast.error('A valid email is required.');
			return;
		}

		disableSignInWithEmail = true;
		const { error } = await toast.promise(supabase.auth.signInWithOtp({ email: email }), {
			loading: 'Sending Email...',
			success: 'Email sent successfully.',
			error: 'Failed to send email.'
		});

		if (error) {
			awaitingOTP = false;
		} else {
			awaitingOTP = true;
		}

		disableSignInWithEmail = false;
	};

	const verifyCode = async () => {
		if (otp && otp.length === 6 && email) {
			const { error } = await supabase.auth.verifyOtp({
				email: email,
				token: otp,
				type: 'email'
			});

			if (error) {
				toast.error(error.message);
			} else {
				awaitingOTP = false;
			}
		} else {
			toast.error('A valid code is required');
		}
	};

	const signInWithApple = async () => {
		const response = await supabase.auth.signInWithOAuth({
			provider: 'apple',
			options: {
				redirectTo: `${window.location.origin}/login_callback`,
				skipBrowserRedirect: true
			}
		});

		const redirect = response.data.url;
		if (redirect) {
			window.open(redirect, '_blank');
		}
	};

	const signInWithGoogle = async () => {
		const response = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/login_callback`,
				skipBrowserRedirect: true
			}
		});

		const redirect = response.data.url;
		if (redirect) {
			window.open(redirect, '_blank');
		}
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const submitFlights = async () => {
		if (!flights) {
			toast.error('The flights text area is empty.');
			return;
		}

		flights = removeUselessText(flights);
		disableSubmit = true;

		const { error } = await toast.promise(
			supabase.functions.invoke('ryanair_verified_flights', {
				body: flights
			}),
			{
				loading: 'Processing Flights...',
				success: 'Flights submitted successfully.',
				error: 'Failed to import flights.'
			}
		);

		if (!error) {
			flights = '';
		}

		disableSubmit = false;
	};

	let user: User | undefined;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, session) => {
			loadingUser = false;
			user = session?.user;
		});

		return data.subscription?.unsubscribe;
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
		rel="stylesheet"
	/>
	<title>Ryanair - Verified Flights</title>
</svelte:head>
<Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
<main>
	<article class="page">
		<header class="page__header">
			<h1 class="page__title">Ryanair Import</h1>
		</header>
		<div class="page__content">
			<p><strong>Step 1: Sign In</strong></p>

			{#if loadingUser}
				<div class="auth__loader"></div>
			{:else if user != null}
				<div class="user__info">
					<h3 class="name" style="display:{user?.user_metadata['full_name'] ? 'block' : 'none'}">
						{user?.user_metadata['full_name']}
					</h3>
					<p class="email">{user?.email}</p>
					<button class="signout__button" on:click={signOut}>Log out</button>
				</div>
			{:else if awaitingOTP}
				<div class="otp__form">
					<input
						bind:value={otp}
						class="otp__input"
						type="text"
						placeholder="Verification Code sent to your email"
						maxlength="6"
					/>
					<button class="otp__validate" on:click={verifyCode}>Verify Code</button>
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<p
						class="return__login"
						on:click={() => {
							awaitingOTP = false;
						}}
					>
						Go Back
					</p>
				</div>
			{:else}
				<div class="signin__form">
					<input bind:value={email} class="email__input" type="email" placeholder="Your Email" />
					<button
						disabled={disableSignInWithEmail}
						class="signin__with__email email__signin"
						on:click={signInWithEmail}
					>
						<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
							<path d="M0 0h24v24H0V0z" fill="none" />
							<path
								fill="white"
								d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"
							/></svg
						>Sign In With Email
					</button>
					<button class="signin__with__oauth apple__signin" on:click={signInWithApple}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="#000000"
							width="24px"
							height="24px"
							viewBox="-52.01 0 560.035 560.035"
						>
							<path
								d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"
							/></svg
						>Sign In With Apple
					</button>
					<button class="signin__with__oauth google__signin" on:click={signInWithGoogle}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24px"
							height="24px"
							viewBox="-3 0 262 262"
							preserveAspectRatio="xMidYMid"
						>
							<path
								d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
								fill="#4285F4"
							/>
							<path
								d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
								fill="#34A853"
							/>
							<path
								d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
								fill="#FBBC05"
							/>
							<path
								d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
								fill="#EB4335"
							/></svg
						>Sign In With Google
					</button>
				</div>
			{/if}

			<p><strong>Step 2: Paste your Verified Flights Email</strong></p>
			<textarea
				bind:value={flights}
				disabled={user == null}
				id="flights_content"
				style="width: 100%; height: 300px"
				placeholder="Example:
            
From: PilotApp@ryanair.com
Subject: Verified Flights for 05-Aug-24
Date: 6 August 2024 at 06:53:14 CEST
To: XXXXXX@ryrefb.com

2024/08/05

FlightNumber 	:	FR 7807
Registration 	:	EIEKT 
City Pair 	:	LTN - BCN
STD 	:	13:00
STA 	:	15:05
Block 	:	8228
Trip+Taxi 	:	5160
Reserves 	:	2278
Uplift 	:	7160
Dep 	:	8380
Arr 	:	3370
Burn Off 	:	5010
Burn Diff 	:	-150
Reason For Extra Fuel 	:	
Adult 	:	162
Child 	:	22
Infant 	:	1
Actual Pax 	:	184
Freight 	:	0
Placard Weight 	:	66990
Airborne 	:	13:33
Landed 	:	15:22
Total flight 	:	01:49
Off Block 	:	13:14
On Block 	:	15:26
Total Block 	:	02:12
Delay Time 1 	:	00:03
Delay Code 1 	:	93
Delay Time 2 	:	00:07
Delay Code 2 	:	36
Delay Time 3 	:	00:04
Delay Code 3 	:	89

Pilot Flying 	:
	Take Off 	:	XXXXXX
	Landing 	:	XXXXXX

Captain Remarks 	:	No Data Available"
			></textarea>
			<button
				disabled={user == null || disableSubmit}
				on:click={submitFlights}
				class="submit__flights">Submit Flights</button
			>
		</div>
	</article>
</main>

<style>
	.user__info {
		display: flex;
		flex-direction: column;
		flex-grow: 0;
		max-width: 400px;
	}

	.signin__form {
		display: flex;
		flex-direction: column;
		flex-grow: 0;
		max-width: 400px;
	}

	.otp__form {
		display: flex;
		flex-direction: column;
		flex-grow: 0;
		max-width: 400px;
	}

	.signin__form > * {
		margin-bottom: 8px;
	}

	.otp__form > * {
		margin-bottom: 8px;
	}

	.email {
		margin-block-start: 0;
	}

	.name {
		margin: 0;
	}

	.signout__button {
		height: 2.5rem;
		width: 140px;
		border-radius: 6px;
		border: 1px solid grey;
		font-family: 'Roboto', sans-serif;
		font-weight: 500;
		font-style: normal;
		background-color: white;
		line-height: 24px;
		color: black;
		cursor: pointer;
	}

	.signout__button:hover {
		background-color: rgb(246, 246, 246);
	}

	.signin__with__oauth:hover {
		background-color: rgb(246, 246, 246);
	}

	.signin__form > button {
		height: 2.5rem;
		border-radius: 6px;
		border: 1px solid grey;
		font-family: 'Roboto', sans-serif;
		font-weight: 500;
		font-style: normal;
		cursor: pointer;
	}

	.signin__with__email {
		background-color: rgb(61, 101, 181);
		line-height: 24px;
		color: white;
	}

	.submit__flights {
		height: 2.5rem;
		border-radius: 6px;
		border: 1px solid grey;
		font-family: 'Roboto', sans-serif;
		font-weight: 500;
		font-style: normal;
		cursor: pointer;
		background-color: rgb(61, 101, 181);
		color: white;
		padding-inline: 1.5rem;
		margin-top: 0.5rem;
	}

	.submit__flights:hover {
		background-color: rgb(46, 86, 166);
	}

	.submit__flights:disabled {
		background-color: rgb(61, 101, 181);
		cursor: not-allowed;
	}

	.otp__validate {
		height: 2.5rem;
		border-radius: 6px;
		border: 1px solid grey;
		font-family: 'Roboto', sans-serif;
		font-weight: 500;
		font-style: normal;
		background-color: rgb(61, 101, 181);
		color: white;
		cursor: pointer;
	}

	.otp__validate:hover {
		background-color: rgb(46, 86, 166);
	}

	.signin__with__email:hover {
		background-color: rgb(46, 86, 166);
	}

	.signin__with__oauth {
		background-color: white;
		line-height: 24px;
		color: black;
	}

	.signin__with__email > svg {
		float: left;
	}

	.signin__with__oauth > svg {
		float: left;
	}

	.otp__input {
		height: 2rem;
		padding-left: 8px;
		background-color: rgb(246, 246, 246);
		border: 1.5px solid grey;
		border-radius: 6px;
		outline: none;
	}

	.otp__input:focus {
		border: 1.5px solid rgb(61, 101, 181);
	}

	.return__login {
		margin: auto;
		font-size: 0.9rem;
		cursor: pointer;
	}

	input[type='email'] {
		height: 2rem;
		padding-left: 8px;
		background-color: rgb(246, 246, 246);
		border: 1.5px solid grey;
		border-radius: 6px;
		outline: none;
	}

	input[type='email']:focus {
		border: 1.5px solid rgb(61, 101, 181);
	}

	.auth__loader {
		margin: auto;
		border: 4px solid #f3f3f3; /* Light grey */
		border-top: 4px solid black; /* Blue */
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
