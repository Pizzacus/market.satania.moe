declare var Snipcart: any;

export default function snipcartReady(): Promise<void> {
	return new Promise((resolve) => {
		function initSnipcart() {
			resolve(Snipcart.ready);
		}
		
		if (typeof Snipcart !== "undefined") {
			initSnipcart();
		} else {
			document.addEventListener("snipcart.ready", initSnipcart, {
				once: true,
			});
		}
	});
}
