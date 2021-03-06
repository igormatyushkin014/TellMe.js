class StateChecker {

	canTalk () {
		return "speechSynthesis" in window;
	}

	canHear() {
		return "SpeechRecognition" in window;
	}
}

class Speaker {

	_onFinishedCallback = null;

	onFinished(callback) {
		this._onFinishedCallback = callback;
		return this;
	}

	constructor(language) {
		this._language = language;
	}

	_loadVoices(callback) {
		var speaker = this;
		var voiceCount = window.speechSynthesis.getVoices().length;

		if (voiceCount == 0) {
			setTimeout(
				function() {
					speaker._loadVoices(callback);
				},
				200
			);
		} else {
			callback();
		}
	}

	_getVoice(language) {
		var availableVoices = window.speechSynthesis.getVoices()
			.filter(function(voice) {
				return voice.lang === language;
			});
		return availableVoices[0];
	}

	say(text) {
		var speaker = this;
		speaker._loadVoices(
			function() {
				var speech = new SpeechSynthesisUtterance();
				speech.voice = speaker._getVoice(speaker._language);
				speech.voiceURI = "native";
				speech.volume = 1; // 0 to 1
				speech.rate = 0.8; // 0.1 to 10
				speech.pitch = 1; //0 to 2
				speech.text = text;
				speech.lang = speaker._language;

				if (speaker._onFinishedCallback) {
					speech.onend = function(event) {
						speaker._onFinishedCallback();
					};
				}

				window.speechSynthesis.speak(speech);
			}
		);
		return speaker;
	}
}

function tellMeIn(language) {
	return new Speaker(language);
}
