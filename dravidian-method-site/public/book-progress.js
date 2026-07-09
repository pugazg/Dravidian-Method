(function () {
	const chapters = [
		{ href: '/book/preface/', label: 'Preface' },
		{ href: '/book/introduction/', label: 'Introduction' },
		{ href: '/book/01-recurring-obligation/', label: 'A Recurring Obligation' },
		{ href: '/book/02-annas-question/', label: "Anna's Question" },
		{ href: '/book/03-after-access/', label: 'After Access' },
		{ href: '/book/04-ownership-ecosystem/', label: 'Ownership as Ecosystem' },
		{ href: '/book/05-innovation-architecture/', label: 'Innovation Architecture' },
		{ href: '/book/06-closing-the-loops/', label: 'Closing the Loops' },
		{ href: '/book/07-unresolved-questions/', label: 'Unresolved Questions' },
		{ href: '/book/08-question-that-moved/', label: 'The Question That Moved' },
	];

	const storagePrefix = 'dravidian-method:reading:';
	const lastKey = `${storagePrefix}last`;
	const path = normalizePath(window.location.pathname);
	const chapterIndex = chapters.findIndex((chapter) => chapter.href === path);
	const isBookPage = chapterIndex >= 0;

	function normalizePath(value) {
		return value.endsWith('/') ? value : `${value}/`;
	}

	function readJson(key) {
		try {
			return JSON.parse(window.localStorage.getItem(key) || 'null');
		} catch {
			return null;
		}
	}

	function writeJson(key, value) {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch {
			// Reading progress is a convenience; the page should work without storage.
		}
	}

	function removeKey(key) {
		try {
			window.localStorage.removeItem(key);
		} catch {
			// Ignore storage failures.
		}
	}

	function getScrollPercent() {
		const root = document.documentElement;
		const max = Math.max(1, root.scrollHeight - window.innerHeight);
		return Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)));
	}

	function getOverallPercent(chapterPercent) {
		return Math.min(
			100,
			Math.max(0, Math.round(((chapterIndex + chapterPercent / 100) / chapters.length) * 100))
		);
	}

	function estimateReadingTime() {
		const content = document.querySelector('.sl-markdown-content');
		if (!content) return null;
		const text = content.textContent || '';
		const words = text.trim().split(/\s+/).filter(Boolean).length;
		if (!words) return null;
		return Math.max(1, Math.round(words / 225));
	}

	function addReadingTime() {
		const title = document.querySelector('h1');
		if (!title || document.querySelector('.book-meta')) return;
		const minutes = estimateReadingTime();
		if (!minutes) return;
		const meta = document.createElement('p');
		meta.className = 'book-meta';
		meta.textContent = `${minutes} min read`;
		title.insertAdjacentElement('afterend', meta);
	}

	function addProgressUi() {
		if (document.querySelector('.book-progress')) return null;
		const progress = document.createElement('div');
		progress.className = 'book-progress';
		progress.innerHTML = [
			'<div class="book-progress__track" aria-hidden="true"><span></span></div>',
			'<div class="book-progress__meta" aria-live="polite">',
			'<span data-chapter-progress>0%</span>',
			'<span data-overall-progress>Book 0%</span>',
			'<button type="button" data-reset-progress>Reset</button>',
			'</div>',
		].join('');
		document.body.appendChild(progress);
		progress.querySelector('[data-reset-progress]')?.addEventListener('click', () => {
			removeKey(`${storagePrefix}${path}`);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			updateProgress();
		});
		return progress;
	}

	function updateProgress() {
		const progress = document.querySelector('.book-progress');
		if (!progress || !isBookPage) return;
		const chapterPercent = getScrollPercent();
		const overallPercent = getOverallPercent(chapterPercent);
		progress.querySelector('.book-progress__track span').style.transform = `scaleX(${chapterPercent / 100})`;
		progress.querySelector('[data-chapter-progress]').textContent = `${chapterPercent}%`;
		progress.querySelector('[data-overall-progress]').textContent = `Book ${overallPercent}%`;
		const payload = {
			href: path,
			label: chapters[chapterIndex].label,
			percent: chapterPercent,
			overallPercent,
			y: Math.round(window.scrollY),
			updatedAt: Date.now(),
		};
		writeJson(`${storagePrefix}${path}`, payload);
		writeJson(lastKey, payload);
	}

	function restorePosition() {
		if (window.location.hash) return;
		const saved = readJson(`${storagePrefix}${path}`);
		if (!saved || saved.percent < 4 || saved.percent > 96 || !saved.y) return;
		window.requestAnimationFrame(() => {
			window.scrollTo({ top: saved.y, behavior: 'auto' });
			updateProgress();
		});
	}

	function addContinueReading() {
		const target = document.querySelector('[data-continue-reading]');
		const saved = readJson(lastKey);
		if (!target || !saved || !saved.href) return;
		const chapter = chapters.find((item) => item.href === saved.href);
		if (!chapter) return;
		target.hidden = false;
		target.innerHTML = [
			'<span>Continue reading</span>',
			`<a href="${chapter.href}">${chapter.label}</a>`,
			`<small>${Math.max(0, Math.min(100, saved.percent || 0))}% complete</small>`,
		].join('');
	}

	function markReadingPath() {
		document.querySelectorAll('.reading-path a[href]').forEach((link) => {
			const href = normalizePath(new URL(link.href, window.location.href).pathname);
			if (href === path) {
				link.classList.add('is-current');
				link.setAttribute('aria-current', 'page');
			}
		});
		const saved = readJson(lastKey);
		if (!saved) return;
		const lastLink = document.querySelector(`.reading-path a[href="${saved.href}"]`);
		if (lastLink && !lastLink.classList.contains('is-current')) {
			lastLink.classList.add('is-last-read');
		}
	}

	function initBookPage() {
		addReadingTime();
		addProgressUi();
		restorePosition();
		updateProgress();
		let ticking = false;
		window.addEventListener(
			'scroll',
			() => {
				if (ticking) return;
				ticking = true;
				window.requestAnimationFrame(() => {
					updateProgress();
					ticking = false;
				});
			},
			{ passive: true }
		);
	}

	markReadingPath();
	addContinueReading();
	if (isBookPage) initBookPage();
})();
