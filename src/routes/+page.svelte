<script>
	import icon from '$lib/images/icon.png?enhanced';
	import googlePlayBadge from '$lib/images/google-play-badge.png';
	import iosBadge from '$lib/images/ios-badge.svg';
	import sc1 from '$lib/images/1_flight_form_light_framed.png';
	import sc2 from '$lib/images/2_flights_light_framed.png';
	import sc3 from '$lib/images/3_jfk_airport_light_framed.png';
	import sc4 from '$lib/images/4_map_light_framed.png';
	import sc5 from '$lib/images/5_flight_form_dark_framed.png';
	import sc6 from '$lib/images/6_flights_dark_framed.png';
	import sc7 from '$lib/images/7_jfk_airport_dark_framed.png';
	import sc8 from '$lib/images/8_map_dark_framed.png';
</script>

<svelte:head>
	<title>Choppy</title>
</svelte:head>
<main>
	<header class="app__header container">
		<div class="app__logo-wrapper">
			<enhanced:img class="app__logo" src={icon} alt="Choppy" />
		</div>
		<div class="app__infos">
			<h1 class="app__name">Choppy</h1>
			<p class="app__description">Keep Your Logbook Steady !</p>
			<div class="app__buttons app__buttons--desktop">
				<a
					href="https://play.google.com/store/apps/details?id=app.pilotdev.mypilotlogbook&hl=en"
					class="app__button-play"
					target="_blank"
					title="Get on Google Play"
				>
					<img src={googlePlayBadge} alt="Get on Google Play" />
				</a>
				<a
					href="https://apps.apple.com/app/choppy-pilot-logbook/id6499055612?platform=iphone"
					class="app__button-ios"
					target="_blank"
					title="Get on Appstore"
				>
					<img src={iosBadge} alt="Get on Appstore" />
				</a>
			</div>
		</div>
	</header>
	<div class="app__buttons app__buttons--mobile container">
		<a
			href="https://play.google.com/store"
			class="app__button-play"
			target="_blank"
			title="Get on Google Play"
		>
			<img src={googlePlayBadge} alt="Get on Google Play" />
		</a>
		<a
			href="https://www.apple.com/ios/app-store/"
			class="app__button-ios"
			target="_blank"
			title="Get on Appstore"
		>
			<img src={iosBadge} alt="Get on Appstore" />
		</a>
	</div>
	<section class="app__screenshots app__section">
		<div class="container">
			<h2 class="app__section-title">Screenshots</h2>
		</div>
		<div class="app__screenshots-wrapper container-desktop">
			<div class="app__screenshots-list">
				<a href={sc1}>
					<img
						src={sc1}
						class="app__screenshot"
						alt="Screenshot of new flight form screen - light mode"
					/>
				</a>
				<a href={sc2}>
					<img
						src={sc2}
						class="app__screenshot"
						alt="Screenshot of flight list screen - light mode"
					/>
				</a>
				<a href={sc3}>
					<img
						src={sc3}
						class="app__screenshot"
						alt="Screenshot of airport information screen - light mode"
					/>
				</a>
				<a href={sc4}>
					<img
						src={sc4}
						class="app__screenshot"
						alt="Screenshot of route map screen - light mode"
					/>
				</a>
				<a href={sc5}>
					<img
						src={sc5}
						class="app__screenshot"
						alt="Screenshot of new flight form screen - dark mode"
					/>
				</a>
				<a href={sc6}>
					<img
						src={sc6}
						class="app__screenshot"
						alt="Screenshot of flight list screen - dark mode"
					/>
				</a>
				<a href={sc7}>
					<img
						src={sc7}
						class="app__screenshot"
						alt="Screenshot of airport information screen - dark mode"
					/>
				</a>
				<a href={sc8}>
					<img src={sc8} class="app__screenshot" alt="Screenshot of route map screen - dark mode" />
				</a>
			</div>
		</div>
	</section>
	<section class="app__fulldescription app__section container">
		<h2 class="app__section-title">Description</h2>
		<div class="app__fulldescription-content">
			<p>
				Choppy is designed for pilots seeking a seamless and efficient way to manage their logbooks.
				With its user-friendly interface and offline capabilities, Choppy ensures your flight logs
				are always up-to-date and accessible. Sync effortlessly across all your devices, and enjoy
				the simplicity that prioritizes your convenience. Additionally, Choppy offers an extensive
				airport database with real-time NOTAM and METAR retrieval, providing essential flight
				information at your fingertips. Experience smooth logging and comprehensive flight data
				management with Choppy – even when the skies get choppy.
			</p>
			<h3 id="choppy-key-features">
				<strong>Choppy: Key Features</strong>
			</h3>
			<ol>
				<li>
					<p><strong>Offline Logbook Access</strong></p>
					<ul>
						<li>Manage and update your logbook without internet connectivity.</li>
					</ul>
				</li>
				<li>
					<p><strong>Multi-Device Sync</strong></p>
					<ul>
						<li>
							Sync your logbook seamlessly across all your devices for easy access anytime,
							anywhere.
						</li>
					</ul>
				</li>
				<li>
					<p><strong>User-Friendly Interface</strong></p>
					<ul>
						<li>Enjoy a simple and intuitive design that prioritizes ease of use.</li>
					</ul>
				</li>
				<li>
					<p><strong>Comprehensive Airport Database</strong></p>
					<ul>
						<li>Access detailed information on airports worldwide.</li>
					</ul>
				</li>
				<li>
					<p><strong>Real-Time NOTAM Retrieval</strong></p>
					<ul>
						<li>
							Stay informed with the latest Notices to Airmen (NOTAMs) for your flight planning.
						</li>
					</ul>
				</li>
				<li>
					<p><strong>METAR Data Integration</strong></p>
					<ul>
						<li>
							Retrieve real-time Meteorological Aerodrome Reports (METARs) to stay updated on
							weather conditions.
						</li>
					</ul>
				</li>
				<li>
					<p><strong>Efficient Flight Logging</strong></p>
					<ul>
						<li>Quickly and easily log flight details, minimizing time spent on paperwork.</li>
					</ul>
				</li>
				<li>
					<p><strong>Automatic Backups</strong></p>
					<ul>
						<li>Ensure your data is always safe with automatic backups.</li>
					</ul>
				</li>
				<li>
					<p><strong>Secure Data Storage</strong></p>
					<ul>
						<li>Keep your information protected with robust security measures.</li>
					</ul>
				</li>
			</ol>
		</div>
	</section>
</main>
