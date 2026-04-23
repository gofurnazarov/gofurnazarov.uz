// ── SHOP CONFIG (URL param: ?shop=elanore) ──
const SHOPS = {
	default: {
		name: 'Gullar.uz',
		logoSuffix: '.uz',
		telegram: 'gofurnazarov',
		phone: '+998-90-123-45-67',
		instagram: '',
	},
	gardenia: {
		name: 'Gardenia',
		logoSuffix: '.uz',
		telegram: 'gardeniatashkent',
		phone: '+99890-93-330-09-09',
		instagram: 'gardenia.uzb',
	},
	mmroses: {
		name: 'M&M Roses',
		logoSuffix: '.uz',
		telegram: 'mmroses',
		phone: '+998994088096',
		instagram: 'mm_rose__',
	},
	moretflowers: {
		name: 'MoretFlowers',
		logoSuffix: '.uz',
		telegram: 'moretflowers',
		phone: '+998 98 880 81 08',
		instagram: 'moretflowers',
	},
	veronica_garden: {
		name: 'VeronicaGarden',
		logoSuffix: '.uz',
		telegram: 'Veronica_garden2',
		phone: '+998335747474',
		instagram: 'veronica_garden__',
	},
};

const params = new URLSearchParams(window.location.search);
const shopKey = params.get('shop') || 'default';
const shop = SHOPS[shopKey] || SHOPS['default'];

// Apply branding
const logoEl = document.getElementById('shopLogo');
if (shopKey !== 'default') {
	logoEl.innerHTML = shop.name.replace(shop.logoSuffix, '') + '<span>' + shop.logoSuffix + '</span>';
}

document.getElementById('footerName').textContent = shop.name + ' © 2026';
document.getElementById('footerIG').href = 'https://instagram.com/' + shop.instagram;
document.getElementById('footerTG').href = 'https://t.me/' + shop.telegram;
document.getElementById('footerPhone').href = 'tel:' + shop.phone.replace(/\s/g, '');
document.getElementById('footerPhoneLink').href = 'tel:' + shop.phone.replace(/\s/g, '');
document.getElementById('footerPhoneLink').textContent = shop.phone;

function tgLink(text) {
	return 'https://t.me/' + shop.telegram + '?text=' + encodeURIComponent(text);
}

// Product order buttons — prefilled deeplink
document.querySelectorAll('.product-order-btn').forEach(btn => {
	const name = btn.dataset.name;
	const price = btn.dataset.price;
	btn.href = tgLink('Salom! ' + name + ' (' + price + ') buyurtma qilmoqchiman. Yetkazib bera olasizmi?');
});

// Urgency fast lane
document.getElementById('urgencyBtn').href = tgLink(
'Salom, gul buyurtma qilmoqchiman. Bugun yetkazib bera olasizmi?');

// ── CARD ANIMATIONS ──
const cards = document.querySelectorAll('.product-card');
const cardObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (!entry.isIntersecting) return;
		const index = Array.from(cards).indexOf(entry.target);
		entry.target.style.animationDelay = (index * 0.12) + 's';
		entry.target.classList.add('visible');
		cardObserver.unobserve(entry.target);
	});
}, {
	threshold: 0.1
});
cards.forEach(card => cardObserver.observe(card));

// ── REVIEWS SLIDER ──
const reviewsScroll = document.getElementById('reviewsScroll');
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');

function getReviewStep() {
	const firstCard = reviewsScroll.querySelector('.review-card');
	if (!firstCard) return 240;
	const gap = parseFloat(window.getComputedStyle(reviewsScroll).columnGap || 12);
	return firstCard.getBoundingClientRect().width + gap;
}

function updateReviewArrows() {
	const maxScroll = reviewsScroll.scrollWidth - reviewsScroll.clientWidth;
	arrowLeft.disabled = reviewsScroll.scrollLeft <= 4;
	arrowRight.disabled = reviewsScroll.scrollLeft >= maxScroll - 4;
}

arrowLeft.addEventListener('click', () => reviewsScroll.scrollBy({
	left: -getReviewStep(),
	behavior: 'smooth'
}));
arrowRight.addEventListener('click', () => reviewsScroll.scrollBy({
	left: getReviewStep(),
	behavior: 'smooth'
}));
reviewsScroll.addEventListener('scroll', updateReviewArrows, {
	passive: true
});
window.addEventListener('resize', updateReviewArrows);
updateReviewArrows();

// ── VIDEO MODAL ──
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');

document.querySelectorAll('.product-preview').forEach(v => v.play().catch(() => {}));

function openVideoModal(src) {
	if (!src) return;
	modalVideo.src = src;
	modalVideo.currentTime = 0;
	videoModal.classList.add('open');
	document.body.style.overflow = 'hidden';
	modalVideo.play().catch(() => {});
}

function closeVideoModal() {
	videoModal.classList.remove('open');
	modalVideo.pause();
	modalVideo.removeAttribute('src');
	modalVideo.load();
	document.body.style.overflow = '';
}

document.querySelectorAll('.product-play').forEach(btn => {
	btn.addEventListener('click', e => {
		e.stopPropagation();
		openVideoModal(btn.dataset.videoSrc);
	});
});

document.querySelectorAll('.circle-frame .inner').forEach(inner => {
	inner.addEventListener('click', () => {
		const btn = inner.closest('.product-media').querySelector('.product-play');
		openVideoModal(btn.dataset.videoSrc);
	});
});

document.getElementById('videoModalClose').addEventListener('click', closeVideoModal);
videoModal.addEventListener('click', e => {
	if (e.target === videoModal) closeVideoModal();
});
document.addEventListener('keydown', e => {
	if (e.key === 'Escape') closeVideoModal();
});

// ── TOAST ──
const customers = [{
		name: 'Zarnigor (Yunusobod)',
		icon: '🌸'
	},
	{
		name: 'Aziza (Mirobod)',
		icon: '✨'
	},
	{
		name: 'Dilnoza (Sergeli)',
		icon: '💐'
	},
	{
		name: 'Lobar (Shayxontohur)',
		icon: '🎁'
	},
];
let toastIndex = 0;
const toast = document.getElementById('social-toast');

function showToast() {
	const c = customers[toastIndex];
	document.getElementById('toast-name').textContent = c.name;
	document.getElementById('toast-icon').textContent = c.icon;
	toast.classList.add('show');
	setTimeout(() => toast.classList.remove('show'), 4000);
	toastIndex = (toastIndex + 1) % customers.length;
}

// setTimeout(showToast, 2500);
// setInterval(showToast, 9000);

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
	a.addEventListener('click', e => {
		const target = document.querySelector(a.getAttribute('href'));
		if (!target) return;
		e.preventDefault();
		target.scrollIntoView({
			behavior: 'smooth'
		});
	});
});

// ── QUIZ ──
const overlay = document.getElementById('quizOverlay');
const quizProgress = document.getElementById('quizProgress');
const dots = [document.getElementById('dot0'), document.getElementById('dot1'), document.getElementById('dot2')];

// Flower data for results
const FLOWERS = [{
		id: 1,
		name: '"Qirolicha" guldastasi',
		tag: '❤️ Eng ko\'p sotilgan · Romantik',
		price: '450 000 so\'m',
		videoSrc: 'assets/videos/flower_1.mp4',
		emoji: '🌹',
		occasions: ['romantik', 'tugilgan', 'sovga'],
		budgets: ['mid', 'high'],
	},
	{
		id: 2,
		name: '"Oq orzular" guldastasi',
		tag: '🌸 Sovg\'aga ideal · Nozik',
		price: '380 000 so\'m',
		videoSrc: 'assets/videos/flower_2.mp4',
		emoji: '🌸',
		occasions: ['tugilgan', 'sovga', 'romantik'],
		budgets: ['low', 'mid'],
	},
	{
		id: 3,
		name: '"Shodlik" to\'plami',
		tag: '💎 Premium · VIP yetkazish',
		price: '720 000 so\'m',
		videoSrc: 'assets/videos/flower_3.mp4',
		emoji: '💎',
		occasions: ['romantik', 'tugilgan', 'sovga'],
		budgets: ['high'],
	},
];

let answers = {
	occasion: null,
	timing: null,
	budget: null
};
let currentStep = 'intro';

function openQuiz() {
	answers = {
		occasion: null,
		timing: null,
		budget: null
	};
	showStep('intro');
	overlay.classList.add('open');
	document.body.style.overflow = 'hidden';
}

function closeQuiz() {
	overlay.classList.remove('open');
	document.body.style.overflow = '';
}

function showStep(stepId) {
	document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
	document.getElementById('step-' + stepId).classList.add('active');
	currentStep = stepId;

	const stepNum = {
		'intro': 0,
		'1': 1,
		'2': 2,
		'3': 3,
		'match': 0,
		'results': 0
	} [stepId] || 0;

	if (stepNum > 0) {
		quizProgress.style.display = 'flex';
		dots.forEach((dot, i) => {
			dot.className = 'quiz-progress-dot';
			if (i < stepNum - 1) dot.classList.add('done');
			else if (i === stepNum - 1) dot.classList.add('active');
		});
	} else {
		quizProgress.style.display = 'none';
	}
}

function getResults() {
	let matches = FLOWERS.filter(f =>
		f.occasions.includes(answers.occasion) &&
		f.budgets.includes(answers.budget)
	);
	if (matches.length === 0) {
		matches = FLOWERS.filter(f => f.budgets.includes(answers.budget));
	}
	if (matches.length === 0) matches = FLOWERS.slice(0, 2);
	return matches.slice(0, 2);
}

function buildResultCards(flowers) {
	const container = document.getElementById('resultCards');
	container.innerHTML = '';
	const timingLabel = answers.timing === 'bugun' ? '⚡ Bugun yetkaziladi' : '🕒 Ertaga yetkaziladi';

	flowers.forEach(f => {
		const msg = 'Salom! ' + f.name + ' (' + f.price + ') buyurtma qilmoqchiman. ' +
			(answers.timing === 'bugun' ? 'Bugun' : 'Ertaga') + ' yetkazib bera olasizmi?';

		const card = document.createElement('div');
		card.className = 'result-card';
		card.innerHTML = `
	<div class="result-card-img">
		<video autoplay muted loop playsinline>
		<source src="${f.videoSrc}" type="video/mp4"/>
		</video>
	</div>
	<div class="result-card-body">
		<div class="result-card-name">${f.name}</div>
		<div class="result-card-tag">${f.tag}<br/>${timingLabel}</div>
		<div class="result-card-price">${f.price}</div>
	</div>
	<a href="${tgLink(msg)}" class="btn-result-order" target="_blank" rel="noreferrer">Buyurtma →</a>
`;
		container.appendChild(card);
		card.querySelectorAll('video').forEach(v => v.play().catch(() => {}));
	});
}

function showResults() {
	const matches = getResults();
	const occasionLabels = {
		romantik: 'Romantik',
		tugulgan: 'Tug\'ilgan kun',
		sovga: 'Sovg\'a'
	};
	document.getElementById('resultsSubtext').textContent =
		(occasionLabels[answers.occasion] || '') + ' · ' +
		(answers.timing === 'bugun' ? 'Bugun' : 'Ertaga') + ' · ' + {
			low: '200–400k',
			mid: '400–700k',
			high: '700k+'
		} [answers.budget];
	buildResultCards(matches);
	showStep('results');
}

// Open quiz
document.getElementById('openQuizBtn').addEventListener('click', openQuiz);

// Close quiz
document.getElementById('quizClose').addEventListener('click', closeQuiz);
overlay.addEventListener('click', e => {
	if (e.target === overlay) closeQuiz();
});

// Start button
document.getElementById('quizStartBtn').addEventListener('click', () => showStep('1'));

// Step option clicks
document.querySelectorAll('#step-1 .quiz-option').forEach(btn => {
	btn.addEventListener('click', () => {
		answers.occasion = btn.dataset.value;
		showStep('2');
	});
});

document.querySelectorAll('#step-2 .quiz-option').forEach(btn => {
	btn.addEventListener('click', () => {
		answers.timing = btn.dataset.value;
		showStep('3');
	});
});

document.querySelectorAll('#step-3 .quiz-option').forEach(btn => {
	btn.addEventListener('click', () => {
		answers.budget = btn.dataset.value;
		// Show match found briefly, then results
		showStep('match');
		setTimeout(showResults, 1200);
	});
});

// Restart
document.getElementById('quizRestartBtn').addEventListener('click', () => {
	answers = {
		occasion: null,
		timing: null,
		budget: null
	};
	showStep('1');
});