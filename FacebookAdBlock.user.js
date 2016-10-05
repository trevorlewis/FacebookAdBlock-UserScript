// ==UserScript==
// @name         FacebookAdBlock
// @version      0.1
// @description  Remove Facebook Ads
// @author       Trevor Lewis
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @match        http://www.facebook.com/*
// @match        http://facebook.com/*
// ==/UserScript==

(function() {

  class App {
    constructor(debug = false) {
      this.debug = debug;
      this.appName = "FacebookAdBlock";
      this.log(this.appName + " - Starting");

      this.delay = 3000;
      this.containerAttributes = {
        'data-testid': 'fbfeed_story'
      };
      this.adTexts = [
        "Suggested Post",
        "Sponsored"
      ];

      this.reset();
      this.run();
    }

    run() {
      sessionStorage.timer = setInterval(function() {
        this.adTexts.map(function(text) {
          let ads = this.find(text);
          this.removeAds(ads);
        }.bind(this));
      }.bind(this), this.delay);
    }

    reset() {
      if (sessionStorage.timer) {
        clearInterval(sessionStorage.timer);
      }
    }

    find(text) {
      let ads = [];
      let xPathRes = document.evaluate("//*[text()='"+text+"']",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      this.log(this.appName + " - Found " + xPathRes.snapshotLength + " Ads");
      for (let i = 0; i < xPathRes.snapshotLength; i++) {
        ads.push(xPathRes.snapshotItem(i));
      }
      return ads;
    }

    removeAds(ads) {
      ads.map(function(element) {
        let container = this.findParent(element);
        if (container) {
          container.parentElement.removeChild(container);
          this.log(this.appName + " - Ad deleted");
        } else {
          element.parentElement.removeChild(element);
          this.log(this.appName + " - Couldn't find the container of the Ad");
        }
      }.bind(this));
    }

    findParent(element) {
      while (element.parentElement) {
        element = element.parentElement;
        for (let attribute in this.containerAttributes) {
          if (element.getAttribute(attribute) == this.containerAttributes[attribute]) {
            return element;
          }
        }
      }
      return null;
    }

    log(text) {
      if (this.debug) {
        console.log(text);
      }
    }
  }

  var a = new App(true);

})();
