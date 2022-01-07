---
title: AT4142 题解
tags: [题解]
uptime: 1625537325
---

作为一个不会双指针的蒟蒻，我们考虑用二分来做这道题。

由于异或运算相当于二进制不进位加法，所以对于两个正整数 $a,b$，一定有 $a\oplus b \le a+b$。同时由于异或满足交换律和结合律，我们可以用类似前缀和的方法预处理出「前缀异或」。

由于「异或运算相当于二进制不进位加法」，我们可以得出一个结论：如果

$$
\sum_{i=l}^ra_i=\bigoplus_{i=l}^ra_i(l<r),
$$

则一定满足

$$
\sum_{i=l}^{r-1}a_i=\bigoplus_{i=l}^{r-1}a_i.
$$

换句话说，如果区间 $[l,r]$ 满足条件，则区间 $[l,l],[l,l+1],\cdots,[l,r-1],[l,r]$ 均满足条件。即右端点是满足二分性质的。考虑枚举左端点 $i$，二分右端点 $j$，则对答案造成的贡献是 $j-i+1$，对于每个 $1\le i \le n$，将贡献累加即可得出答案。

时间复杂度 $O(n \log n)$，可以通过此题。

```cpp
inline bool Ck(int i, int mid) { return qzh[mid] - qzh[i - 1] == (qzxor[mid] ^ qzxor[i - 1]); }

signed main() {
  in(n)(a, n);
  re(i, n) qzh[i] = qzh[i - 1] + a[i], qzxor[i] = qzxor[i - 1] ^ a[i];
  re(i, n) {
    int l = i, r = n;
    while (r - l > 1) {
      int mid = (l + r) / 2;
      if (Ck(i, mid))
        l = mid;
      else
        r = mid - 1;
    }
    int res = Ck(i, r) ? r : l;
    ans += res - i + 1;
  }
  out(ans)('\n');
  return 0;
}
```
