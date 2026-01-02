<script lang="ts">
	interface Props {
		onComingSoon?: (serviceName: string) => void;
	}

	let { onComingSoon }: Props = $props();

	function handleComingSoon(serviceName: string) {
		onComingSoon?.(serviceName);
	}

	// Contact information
	const contact = {
		phone: '+233 557 190 318',
		phoneDialable: '+233557190318',
		email: 'support@macelectronics.com',
		whatsappNumber: '233557190318',
		facebook: 'https://facebook.com/macelectronics',
		twitter: 'https://twitter.com/macelectronics',
		instagram: 'https://instagram.com/macelectronics'
	};
</script>

<footer class="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
			<!-- Company Info -->
			<div class="lg:col-span-1">
				<div class="flex items-center mb-6">
					<div class="bg-primary-400 p-2 rounded-lg mr-3">
						<div class="w-6 h-6 bg-white rounded flex items-center justify-center">
							<i class="fas fa-mobile-alt text-primary-600 text-sm"></i>
						</div>
					</div>
					<span class="text-white font-display font-bold text-xl tracking-wide">MACELECTRONICS</span>
				</div>

				<p class="text-gray-300 mb-6 leading-relaxed">
					Macelectronics Ghana makes digital services simple and swift. Quickly recharge mobile data, call credit, and pay utility bills in just a few clicks.
				</p>

				<div class="mb-4 space-y-2">
					<a
						href="https://wa.me/{contact.whatsappNumber}"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition-colors"
					>
						<i class="fab fa-whatsapp text-lg"></i>
						<span>WhatsApp: {contact.phone}</span>
					</a>
					<a
						href="tel:{contact.phoneDialable}"
						class="flex items-center gap-2 text-sm text-gray-300 hover:text-primary-300 transition-colors"
					>
						<i class="fas fa-phone text-sm"></i>
						<span>Call: {contact.phone}</span>
					</a>
					<a
						href="mailto:{contact.email}"
						class="flex items-center gap-2 text-sm text-gray-300 hover:text-primary-300 transition-colors"
					>
						<i class="fas fa-envelope text-sm"></i>
						<span>{contact.email}</span>
					</a>
				</div>

				<!-- Social Links -->
				<div class="flex space-x-4 mt-4">
					<a href={contact.facebook} target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all duration-200" aria-label="Follow us on Facebook">
						<i class="fab fa-facebook-f"></i>
					</a>
					<a href={contact.twitter} target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky-500 transition-all duration-200" aria-label="Follow us on Twitter">
						<i class="fab fa-twitter"></i>
					</a>
					<a href={contact.instagram} target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-all duration-200" aria-label="Follow us on Instagram">
						<i class="fab fa-instagram"></i>
					</a>
					<a href="https://wa.me/{contact.whatsappNumber}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-all duration-200" aria-label="Chat on WhatsApp">
						<i class="fab fa-whatsapp"></i>
					</a>
				</div>
			</div>

			<!-- Our Services -->
			<div>
				<h3 class="text-xl font-semibold mb-6">Our Services</h3>
				<ul class="space-y-3">
					<li><a href="/internet" class="text-primary-300 hover:text-primary-200 transition-colors duration-200">Internet</a></li>
					<li>
						<button type="button" onclick={() => handleComingSoon('Airtime')} class="text-gray-300 hover:text-primary-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
							>Airtime</button
						>
					</li>
					<li>
						<button type="button" onclick={() => handleComingSoon('Electricity')} class="text-gray-300 hover:text-primary-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
							>Electricity</button
						>
					</li>
				</ul>
			</div>

			<!-- More Services -->
			<div>
				<h3 class="text-xl font-semibold mb-6">Utilities</h3>
				<ul class="space-y-3">
					<li>
						<button type="button" onclick={() => handleComingSoon('Water')} class="text-gray-300 hover:text-primary-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
							>Water</button
						>
					</li>
					<li>
						<button type="button" onclick={() => handleComingSoon('DStv')} class="text-gray-300 hover:text-primary-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
							>DStv</button
						>
					</li>
					<li>
						<button type="button" onclick={() => handleComingSoon('StarTimes')} class="text-gray-300 hover:text-primary-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
							>StarTimes</button
						>
					</li>
				</ul>
			</div>

			<!-- Help & About -->
			<div>
				<h3 class="text-xl font-semibold mb-6">Help & About</h3>
				<ul class="space-y-3">
					<li>
						<button type="button" onclick={() => handleComingSoon('About Us')} class="text-gray-300 hover:text-primary-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
							>About Us</button
						>
					</li>
					<li>
						<button type="button" onclick={() => handleComingSoon('Contact Us')} class="text-gray-300 hover:text-primary-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
							>Contact Us</button
						>
					</li>
					<li>
						<button type="button" onclick={() => handleComingSoon('Support')} class="text-gray-300 hover:text-primary-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
							>Support</button
						>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Footer -->
		<div class="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
			<p class="text-gray-400 text-sm">2025 Macelectronics. All rights reserved.</p>
			<p class="text-gray-500 text-sm mt-4 sm:mt-0">v1.0.1</p>
		</div>
	</div>
</footer>
