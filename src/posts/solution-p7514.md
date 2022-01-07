---
title: P7514 题解
tags: ["题解"]
uptime: 1618037488
---

说一下我在考场上写的思路，不一定正确。

首先，最优策略一定是翻按照正面数字正序排序后的前后缀。

所以，我们可以预处理出只翻第 $1,1 \sim 2,1\sim3,\cdots,1\sim m$ 张牌（即前 $m$ 张）的最大最小值 $LMax(i),LMin(i)$，以及只翻第 $n,n-1\sim n,n -2\sim n,\cdots,n-m+1 \sim n$ 张牌（即后 $m$ 张牌）的最大最小值 $RMax(i), RMin(i)$。特别的，$LMin(0)=RMin(n+1)=a_{1\text{正面}}, LMax(0)=RMax(n+1)=a_{n\text{正面}}$。这部分可以用一个 set 维护，复杂度 $O(m\log m)$。

然后枚举 $i,j$ 表示翻前 $i$ 张和后 $j$ 张。此时的极差

$$
F(i,j)=\begin{cases}RMax(j)-LMin(i)&LMax(i)=a_n \wedge RMin(j)=a_1\\\max\{LMax(i),RMax(j)\}-LMin(i)&LMax(i)\ne a_n \wedge RMin(j)=a_1\\RMax(j)-\min\{LMin(i),RMin(j)\}&LMax(i)=a_n \wedge RMin(j)\ne a_1\\\max\{LMax(i),RMax(j)\}-\min\{LMin(i),RMin(j)\}&\text{otherwise}\end{cases}
$$

但是这样做的复杂度为 $O(n^2 \log n)$ 太高了过不去，必须优化一下。我们可以用一种类似前缀和的方法维护 $RMax_i-RMin_i$ 的后缀最小值的下标 $P_i$。这样就可以避免枚举 $j$。

上面可能没说清 $P_i$ 的意思。$P_i$ 为满足 $\min_{j=i}^n\{RMax(j)-RMin(j)\}=RMax(P_i)-RMin(P_i)$ 条件的最大值。

此时的答案为：

$$
\begin{aligned}\min\limits_{i=0}^m&\{F(i,P_{i+1+n-m})\}\end{aligned}
$$

总复杂度 $O((m+n) \log m)$，常数有点大，不过开了 O2 应该能过。

**Upd. 4-11:** 规范化 Latex。
