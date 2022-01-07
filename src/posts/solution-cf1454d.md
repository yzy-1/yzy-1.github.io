---
title: CF1454D 题解
tags: [题解]
uptime: 1606539098
---

## 题目大意

共 $t (t\le 5000)$ 组数据，对于每组数据输入一个整数 $n (2 \le n \le 10^{10})$ 请构造一个长度为 $k$ 的数列 $a$，满足以下条件：

- $\forall i \in a : i > 1$；
- $\prod_{i=1}^k a_i = n$；
- $\forall i \in [2,k] : a_i \bmod a_{i-1} = 0$；
- $k$ 尽可能大。

对于每组数据第一行输出一个整数 $k$，第二行输出 $k$ 个整数 $a_i$，如果有多个数列满足条件任意输出一个。

## 做法

通过分析样例可得, 最优的数列一定形如「$k - 1$ 个相同的质数 $x$ + 一个数 $\dfrac{n}{x ^{k-1}}$」。

那么这个问题就变成了, 找出一个数量最多的质因子 $x$，输出 $k-1$ 个 $x$ 和 $\dfrac{n}{x ^{k-1}}$。

由于这题的 $n$ 最大可以到 $10^{10}$，我们可以先打出一个 $1 \sim \sqrt{10^{10}}$ 的质数表，然后对于每个 $n$ 枚举质数表里的所有质数，看看能被整除几次，选择一个整除次数最多的质数输出即可。

时间复杂度：$\mathcal O(t \sqrt{N})$。

## Code

```cpp
bool isPrime[100007];
std::vector<int> primes;
// 打出 1-1e5 的质数表, 放入 `primes` 中
void Pre() {
  int n = (int)1e5;
  for (int i = 2; i <= n; i++) {
    isPrime[i] = true;
  }
  for (int i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (int j = 2 * i; j < n; j += i) isPrime[j] = false;
    }
  }
  for (int i = 1; i <= n; i++) {
    if (isPrime[i]) {
      primes.push_back(i);
    }
  }
}

int t, sum, id;
ll n;

// 判断 x 能整除 n 几次, 并更新最大值
void count(int x) {
  ll w = n;
  int cnt = 0; // 能整除的次数
  while (w % x == 0) {
    ++cnt;
    w /= x;
  }
  if (cnt > sum) {
    sum = cnt;
    id = x;
  }
}

int main() {
  Pre(); // 预处理
  scanf("%d", &t);
  while (t--) {
    bool fl = false; // 判断 n 是不是合数
    sum = 0;
    scanf("%lld", &n);
    for (int x : primes) {
      if (n % x == 0) {
        fl = true;
        count(x);
      }
    }
    if (!fl) {
      // 如果 n 是质数, 则直接输出它自己即可
      puts("1");
      printf("%lld\n", n);
      continue;
    }
    printf("%d\n", sum);
    for (int i = 1; i < sum; ++i) {
      printf("%d ", id);
      n /= id;
    }
    printf("%lld\n", n);
  }
  return 0;
}
```
