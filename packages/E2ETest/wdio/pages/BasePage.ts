/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 */

import {
  REACT_CONTROL_ERROR_TEST_ID,
  BACK_BUTTON,
  TREE_DUMP_RESULT,
} from 'react-native-windows/RNTester/js/examples-win/LegacyTests/Consts';

export function By(testId: string): WebdriverIO.Element {
  // eslint-disable-next-line no-undef
  return $('~' + testId);
}

export function wait(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export class BasePage {
  isElementLoaded(element: string): boolean {
    return By(element).isDisplayed();
  }

  waitForElementLoaded(element: string, timeout?: number) {
    // eslint-disable-next-line no-undef
    browser.waitUntil(
      () => {
        return this.isElementLoadedOrLoadBundleError(element);
      },
      this.timeoutForPageLoaded(timeout),
      'Wait for element ' + element + ' timeout'
    );
  }

  getTreeDumpResult(): boolean {
    var testResult = false;
    const maxWait = 20;
    var waitCount = 1;
    do {
      testResult = this.treeDumpResult.getText() === 'TreeDump:Passed';
      if (!testResult) {
        console.log(
          '####Waiting for treedump comparison result ' +
            waitCount +
            '/' +
            maxWait +
            '...####'
        );
        wait(100);
        waitCount += 1;
      }
    } while (waitCount <= maxWait && !testResult);

    return testResult;
  }

  protected timeoutForPageLoaded(currentTimeout?: number) {
    if (currentTimeout) {
      return currentTimeout;
    }
    return this.waitforPageTimeout;
  }

  protected get homeButton() {
    return By(BACK_BUTTON);
  }

  private get reactControlErrorMessage() {
    return By(REACT_CONTROL_ERROR_TEST_ID);
  }

  private isElementLoadedOrLoadBundleError(element: string): boolean {
    if (this.reactControlErrorMessage.isDisplayed()) {
      throw "ReactControl doesn't load bundle successfully: " +
        this.reactControlErrorMessage.getText();
    }
    return this.isElementLoaded(element);
  }

  private get treeDumpResult() {
    return By(TREE_DUMP_RESULT);
  }

  // Default timeout for waitForPageLoaded command in PageObject
  private waitforPageTimeout: number = 60000;
}
