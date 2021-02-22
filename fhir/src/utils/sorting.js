const buildSortArray = (sort) => {
    return sort.split(',').filter((str) => str).map((str) => {
        return {
            field: str[0] === '-' ? str.substring(1) : str,
            multiplier: str[0] === '-' ? -1 : 1
        }
    });
};

const buildCompareFn = (sort) => {
    const sortByArray = buildSortArray(sort);

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
        let winningVal = arrays[winningIdx][positions[winningIdx]];

        for (let i = 1; i < positions.length; i++) {
            if (winningVal === null || winningVal === undefined
                || compareFn(winningVal, arrays[i][positions[i]]) > 0) {
                winningIdx = i;
                winningVal = arrays[i][positions[i]];
            }
        }

        if (winningVal !== null && winningVal !== undefined) {
            result.push(arrays[winningIdx][positions[winningIdx]]);
            positions[winningIdx]++;
            count++;
        } else {
            break;
        }
    }

    return [
        result,
        positions
    ];
};

module.exports = {
    buildSortArray,
    buildCompareFn,
    mergeResults
};
