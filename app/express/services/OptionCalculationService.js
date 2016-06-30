var optionCalculationService = {

    getOptionData: function(marketData, volatilityData, monthlyOptions, closeBeforeExpiry) {

        monthlyOptions.forEach(function(monthlyOption, index) {
            var expiryDate = optionCalculationService.getUpdatedDate(Date.parse(monthlyOption.expiry.date), -closeBeforeExpiry, marketData, 5);
            var openDate = optionCalculationService.getUpdatedDate(Date.parse(monthlyOption.open.date), 0, marketData, 5);
            var expiryMarketData = marketData[expiryDate.getTime()];
            var openMarketData = marketData[openDate.getTime()];

            if (expiryMarketData && openMarketData) {

                optionCalculationService.setOptionMarketData(monthlyOption.expiry, expiryMarketData, expiryDate.toString("d-MMM-yyyy"));
                optionCalculationService.setOptionMarketData(monthlyOption.open, openMarketData, openDate.toString("d-MMM-yyyy"));
                optionCalculationService.setOptionVariance(monthlyOption, marketData);
                optionCalculationService.setOptionVolatility(monthlyOption.expiry, volatilityData, 5);
                optionCalculationService.setOptionVolatility(monthlyOption.open, volatilityData, 5);

            } else {
                console.log("No market data for: Expiry=" + expiryDate + ", Open=" + openDate);
            }

        });

        return monthlyOptions;
    },

    getUpdatedDate: function(date, adjustByDays, marketData, threshold) {

        var updatedDate = new Date(date.getTime());
        updatedDate.addDays(adjustByDays);
        var currentDateMarketData = marketData[updatedDate.getTime()];
        var updatedThreshold = 0;

        while (!currentDateMarketData && (updatedThreshold <= threshold)) {
            updatedDate.addDays(1);
            currentDateMarketData = marketData[updatedDate.getTime()];
            updatedThreshold++;
        }
        return updatedDate;
    },

    setOptionMarketData: function(optionDataForDate, marketDataForDate, date) {

        optionDataForDate.date = date;
        optionDataForDate.open = marketDataForDate.open;
        optionDataForDate.close = marketDataForDate.close;
        optionDataForDate.high = marketDataForDate.high;
        optionDataForDate.low = marketDataForDate.low;
    },

    setOptionVariance: function(monthlyOption, marketData) {

        var highestHigh = monthlyOption.open.high;
        var lowestLow = monthlyOption.open.low;
        var expiryDateForVariance = Date.parse(monthlyOption.expiry.date);
        var openDateForVariance = Date.parse(monthlyOption.open.date);

        while (expiryDateForVariance > openDateForVariance) {

            openDateForVariance.addDays(1);

            if (marketData[openDateForVariance.getTime()]) {
                if (marketData[openDateForVariance.getTime()].high > highestHigh) {
                    highestHigh = marketData[openDateForVariance.getTime()].high;
                }
                if (marketData[openDateForVariance.getTime()].low < lowestLow) {
                    lowestLow = marketData[openDateForVariance.getTime()].low;
                }
            }
        }

        monthlyOption.variance = (monthlyOption.expiry.close - monthlyOption.open.open) / monthlyOption.open.open;

        if (monthlyOption.variance > 0) {
            monthlyOption.highLowVariance =
                ((highestHigh - monthlyOption.open.open) / monthlyOption.open.open) - monthlyOption.variance;
        } else {
            monthlyOption.highLowVariance =
                ((lowestLow - monthlyOption.open.open) / monthlyOption.open.open) - monthlyOption.variance;
        }
    },

    setOptionVolatility: function(optionDataForDate, marketData, threshold) {

        var volatilityDate = new Date.parse(optionDataForDate.date);
        var updatedThreshold = 0;

        while (!marketData[volatilityDate.getTime()] && (updatedThreshold <= threshold)) {
            volatilityDate.addDays(-1);
            updatedThreshold++;
        }

        if (updatedThreshold == 0) {
            optionDataForDate.volatility = marketData[volatilityDate.getTime()].open;
        } else {
            optionDataForDate.volatility = marketData[volatilityDate.getTime()].close;
        }

    }

};

module.exports = optionCalculationService;
