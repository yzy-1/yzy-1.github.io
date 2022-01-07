---
title: P7492 题解
tags: ["题解"]
uptime: 1637154566
---

单根号锤了 std 的俩 $\log$！

考虑分块，把原序列分成 $\sqrt n$ 块。

对于 $1$ 操作是经典操作了。直接维护块内最大连续字段和、最大前缀和、最大后缀和。然后查询时拼接块处理，输出最大值即可。

对于 $2$ 操作，我们可以根据按位 $\rm or$ 运算的性质，由于一个数按位 $\rm or$ 上另一个数后，该数的 $\rm popcount$ 值一定会增大。最坏情况下，该数初始为 $0$，则最多进行 $32$ 次按位 $\rm or$ 操作后一定为 $-1$。此时再对 $-1$ 操作值都不会改变了。所以我们可以记录块内所有元素的按位 $\rm and$ 值。如果 $2$ 操作到某个整块时，该块内元素的按位 $\rm and$ 和 $x$ 满足 $x\operatorname{and} k = k$，则该操作可以忽略，直接 `continue` 掉这个块即可。

接下来是复杂度分析，考虑到一个块最多被有效操作 $32$ 次，共有 $\sqrt n$ 个块。故整块 $2$ 操作势能上界为 $O(\log V\sqrt n \times \sqrt n) = O(n\log V)$。综上，该算法时间复杂度为 $O(n\sqrt n + n \log V)$。实际表现要比 std 的 $O(n\log n \log V)$ 要优秀。

```cpp
void Up(int x) {
  int b = bl[x];
  yu[b] = -1, isum[b] = lsum[b] = rsum[b] = sum[b] = 0;
  rep (i, lbl[x], rbl[x])
    yu[b] &= a[i], sum[b] += a[i], up(lsum[b], sum[b]);
  ll s = 0;
  per (i, rbl[x], lbl[x])
    s += a[i], up(rsum[b], s);
  s = 0;
  rep (i, lbl[x], rbl[x])
    s += a[i], up(s, 0), up(isum[b], s);
}

void Init() {
  sz = sqrt(n);
  re (i, n)
    bl[i] = (i - 1) / sz + 1, lbl[i] = (bl[i] - 1) * sz + 1, rbl[i] = min(n, bl[i] * sz);
  ste(i, 1, n, sz) Up(i);
}

void Or(int l, int r, int x) {
  if (bl[l] == bl[r]) {
    rep (i, l, r)
      a[i] |= x;
    Up(l);
    return;
  }
  Or(l, rbl[l], x);
  ste(i, lbl[l] + sz, rbl[r] - sz, sz) {
    int b = bl[i];
    if ((yu[b] & x) != x) Or(lbl[i], rbl[i], x);
  }
  Or(lbl[r], r, x);
}

ll Ask(int l, int r) {
  ll ans = 0, s = 0, ss = 0;
  if (bl[l] == bl[r]) {
    rep (i, l, r)
      s += a[i], up(s, 0), up(ans, s);
    return ans;
  }
  rep (i, l, rbl[l])
    s += a[i], up(s, 0), up(ans, s);
  s = 0;
  per (i, rbl[l], l)
    s += a[i], up(ss, s);
  rep (b, bl[l] + 1, bl[r] - 1)
    up(ans, ss + lsum[b]), ss += sum[b], up(ss, rsum[b]), up(ans, ss), up(ans, isum[b]);
  s = 0;
  rep (i, lbl[r], r)
    s += a[i], up(s, 0), up(ans, s), ss += a[i], up(ans, ss);
  return ans;
}
```
