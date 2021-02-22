const buildCompareFn = (sort) => {
    const sortByArray = sort.split(',').filter((str) => str).map((str) => {
        return {
            field: str[0] === '-' ? str.substring(1) : str,
            multiplier: str[0] === '-' ? -1 : 1
        };
    });

    return (a1, a2) => {
        if (!a1) {
            if (a2) {
                return -1;
            } else {
                return 0;
            }
        } else if (!a2) {
            return 1;
        } else {
            let value = 0;
            sortByArray.forEach((sortObj) => {
                if (a1[sortObj.field] < a2[sortObj.field]) {
                    value = -1 * sortObj.multiplier;
                    return;
                } else if (a1[sortObj.field] > a2[sortObj.field]) {
                    value = 1 * sortObj.multiplier;
                    return;
                }
            });

            return value;
        }
    };
};

const mergeResults = (compareFn, limit, ...arrays) => {
    let count = 0;
    const positions = arrays.map((a) => 0);
    const result = [];

    while (count < limit) {
        let winningIdx = 0;

        for (let i = 1; i < positions.length; i++) {
            if (compareFn(arrays[winningIdx][positions[winningIdx]], arrays[i][positions[i]]) <= 0) {
                winningIdx = i;
            }
        }

        result.push(arrays[winningIdx][positions[winningIdx]]);
        positions[winningIdx]++;
        count++;
    }

    return [
        result,
        positions
    ];
};

module.exports = {
    buildCompareFn,
    mergeResults
};
