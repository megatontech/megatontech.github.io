function isEven(num) {
    return num % 2 === 0;
}

function solution(A, K) {
    if (K === 0) {
        return -1;
    }
    let maxNum = -1;
    function dp(i, sum, remain) {
        if (remain === 0) {
            if (isEven(sum) && sum > maxNum) {
                maxNum = sum;
            }
            return;
        }
        for (let j = i + 1; j < A.length; j++) {
            dp(j, sum + A[j], remain - 1);
        }
    }
    for (let i = 0; i < A.length; i++) {
        dp(i, A[i], K - 1);
    }
    return maxNum;
}