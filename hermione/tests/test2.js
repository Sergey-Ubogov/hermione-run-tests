const containerSelector = '.converter-form';

describe('test2', function() {
    it('rub to euro', function() {
        return this.browser
            .url('/')
            .keys(['курс доллара к евро', '\uE007'])
            .waitForVisible(containerSelector, 3000)
            .assertView('converter is visible', containerSelector)
    });
});
