<script lang="ts">
	// FAQ items data
	const faqItems = [
		{
			question: 'How do I recharge my mobile data?',
			answer:
				"To recharge your mobile data, select your preferred data plan, enter your phone number, and complete the payment via mobile money or card. Your data will be credited instantly."
		},
		{
			question: 'What payment methods do you accept?',
			answer: 'We accept various payment methods including mobile money (MTN, Vodafone, AirtelTigo), debit/credit cards, and bank transfers. All transactions are secure and encrypted.'
		},
		{
			question: 'How long does it take to receive my data or airtime?',
			answer:
				"Most transactions are completed within 30 seconds to 2 minutes. In rare cases, it may take up to 30 minutes. If you don't receive your data or airtime within this time, please contact our support team for assistance."
		},
		{
			question: "Can I get a refund if there's an issue with my transaction?",
			answer:
				'Yes, we have a refund policy in place. If you experience any issues with your transaction, please contact our customer support within 24 hours with your transaction details. Our team will investigate and process your refund if the issue is verified.'
		}
	];

	let openIndex = $state<number | null>(null);

	function toggleFaq(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<section id="faq" class="py-20 bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16 scroll-animation">
			<h2 class="text-4xl lg:text-5xl font-display font-black text-navy-900 mb-6 tracking-tight">
				Frequently Asked <span class="text-primary-500">Questions</span>
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Find answers to common questions about our services and how to use our platform.</p>
		</div>

		<div class="space-y-6">
			{#each faqItems as item, index}
				<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
					<button class="w-full flex items-center justify-between p-6 text-left" onclick={() => toggleFaq(index)} aria-expanded={openIndex === index} aria-controls={`faq-${index}`}>
						<h3 class="text-lg font-semibold text-navy-900">{item.question}</h3>
						<div class="text-primary-500 transform transition-transform duration-200 {openIndex === index ? 'rotate-180' : ''}">
							<i class="fas fa-chevron-down"></i>
						</div>
					</button>
					<div id={`faq-${index}`} class="px-6 pb-6 pt-0 transition-all duration-200 {openIndex === index ? 'block' : 'hidden'}">
						<p class="text-gray-600">
							{item.answer}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
