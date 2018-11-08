const containerSelector = '.converter-form';

describe('test1', function() {
    it('rub to dollar', function() {
        return this.browser
            .url('/')
            .keys(['курс доллара к рублю', '\uE007'])
            .waitForVisible(containerSelector, 3000)
            .assertView('converter is visible', containerSelector)
    });
});
