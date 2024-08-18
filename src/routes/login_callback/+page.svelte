<script lang="ts">
	const parseSupabaseUrl = (url: string) => {
		let parsedUrl = url;
		if (url.includes('#')) {
			parsedUrl = url.replace('#', '?');
		}

		return parsedUrl;
	};

	const url = parseSupabaseUrl(window.location.hash);
	const parsedUrl = new URLSearchParams(url);
	const params = Object.fromEntries(parsedUrl.entries());

	window.opener.postMessage(params, window.location.origin);
	window.close();
</script>

<main>
	<article class="page">
		<header class="page__header">
			<h1 class="page__title">Signing In...</h1>
		</header>
		<div class="page__content">
			<div class="loader"></div>
		</div>
	</article>
</main>

<style>
	.loader {
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
