{"title":"P7650 题解","tags":["题解"],"uptime":1624970874}
---
## 题目大意

给你一个排列 $p_i$，每次可以将第 $i$ 个元素移到第 $j$ 个位置，花费 $i+j$ 的代价，问最少花费多少代价将这个排列变成 $1\sim n$ 的排列。

## 大体思路

对于一个数字 $i$，设它现在的下标为 $p_i$。它要移动到正确的位置（即数字 $i+1$ 的前面一个位置），有两种方式：用一次操作将它「主动」移过去，或者把 $[p_i+1\sim p_{i+1}-1]$ 之间的数字全部移走，让这个数「被动」跑到这个位置。如果 $p_i<p_{i+1}$，则用两种方式移动均可。否则，只能使用第一种方式。

我们可以用上面的方法，从 $n-1$ 至 $1$ 移动每个数。由于是「倒序」移动，所以当移动数 $i$ 时，$i+1\sim n$ 就已经排好序了，且 $1\sim i$ 的**相对**位置和未排序前一样。

我们设 $dp(i,j)$ 表示现在要排 $i$ 这个数，已经排好 $i+1\sim n$，且 $i$ 要放到**一开始的序列**的第 $j$ 号位置的最小代价。记 $now(x)$ 为数字 $x$ 现在的位置，$pos(x)$ 为数字 $x$ 一开始的位置。先来考虑第一种移动方式，我们可以枚举 $j$，即
$$
dp(i,j)=\min\{dp(i+1,j)+now(i)+now(j)\}.
$$
注意这里是 $now(j)$ 而不是 $j$，因为 $j$ 是**初始**序列的下标。

如果使用第二种移动方式，则需要麻烦一些了。根据[徐源盛大佬的论文《对一类动态规划问题的研究》](https://wenku.lingfengyun.com/view-2d83023e2de246c6bf6cf67626b153b7.html)，我们可以知道一个性质：当前决策对未来行动的费用影响只与当前决策有关。也就是说，如果 $i$ 这个数不动，那么可能对以后的决策花费产生影响，具体一点就是初始位置在 $[pos(i)+1, j-1]$ 之间的数在排序过程中都需要跨越一次 $i$。根据论文，我们知道对于整数 $x,x<i$，$x$ 跨越 $i$ 对答案所增加的代价是 $i-x$。由于「当前决策对未来行动的费用影响只与当前决策有关」，我们可以直接把这个 $i-x$ 加进当前决策的花费中。也就是说，对于移动方式二，我们有以下转移方程：
$$
dp(i,pos(i))=\min_{j=pos(i+1)}^n\{dp(i+1,j)+(\sum_{k=pos(i)+1}^{j-1}\max\{i-s_k,0\})\}
$$
转移方程里的那个求和可以在转移的过程中记录，所以该 DP 的时间复杂度为 $O(n^2)$。

## 核心代码

```cpp
memset(dp, 0x3F, sizeof dp);
dp[n][n] = 0;
per(i, n - 1, 1) {
  int posi = 1, posj = 1;
  re(j, pos[i] - 1) posi += (s[j] < i);
  // 移动方式 1
  re(j, n) {
    posj += (s[j] < i);
    if (dp[i + 1][j] != 0x3F3F3F3F) dp[i][j] = dp[i + 1][j] + posi + posj;
  }
  // 移动方式 2
  int sum = 0;
  rep(j, pos[i] + 1, n) {
    if (dp[i][pos[i]] > dp[i + 1][j] + sum) dp[i][pos[i]] = dp[i + 1][j] + sum, pre[i] = j;
    sum += max(0, i - s[j]);
  }
}
```
