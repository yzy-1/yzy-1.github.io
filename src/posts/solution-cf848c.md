---
title: CF848C 题解
tags: [题解]
uptime: 1637313401
---

题解区好像都是 polylog 的解法，我来发一个 $O(n^{\frac 5 3}\log n)$ 的解法。

## 题目大意

设 $F(i,l,r)$ 为值 $i$ 在区间 $[l,r]$ 内最后一次出现的下标减第一次出现的下标。

- `1 x y`：单点修改 $a_x \gets y$。
- `2 l r`：求 $\sum_{i=1}^n F(i,l,r)$。

## 做法 1（TLE）

考虑带修莫队。对于每个不同的颜色，开一个 `set` 维护该颜色出现的下标。则颜色 $i$ 对答案的贡献就为 `*st[i].rbegin()-*st[i].begin()`。按照一般带修莫队的套路维护即可。

每移动一次端点是 $O(\log n)$ 的，故时间复杂度为 $O(n^{\frac 5 3}\log n)$，常数较大。加上奇偶优化后本机 $n=10^5$ 随机数据大概 $5.8$ 秒。

```cpp
void Add(int x) {
  if (st[a[x]].size()) res -= *st[a[x]].rbegin() - *st[a[x]].begin();
  st[a[x]].insert(x);
  res += *st[a[x]].rbegin() - *st[a[x]].begin();
}
void Del(int x) {
  res -= *st[a[x]].rbegin() - *st[a[x]].begin();
  st[a[x]].erase(x);
  if (st[a[x]].size()) res += *st[a[x]].rbegin() - *st[a[x]].begin();
}
void AddT(int x, int l, int r) {
  if (l <= q1[x].x && q1[x].x <= r) Del(q1[x].x);
  a[q1[x].x] = q1[x].y;
  if (l <= q1[x].x && q1[x].x <= r) Add(q1[x].x);
}
void DelT(int x, int l, int r) {
  if (l <= q1[x].x && q1[x].x <= r) Del(q1[x].x);
  a[q1[x].x] = q1[x].lst;
  if (l <= q1[x].x && q1[x].x <= r) Add(q1[x].x);
}

signed main() {
  in(n)(msum)(a_, n), sz = pow(n, 2.0 / 3);
  re (i, n)
    a[i] = a_[i];
  int cnt1 = 0;
  re (i, msum) {
    int op = in(), x = in(), y = in();
    if (op == 1) {
      q1[++cnt1] = {x, y, a[x]};
      a[x] = y;
    } else {
      ++m2;
      q2[m2] = {x, y, cnt1, m2};
    }
  }
  re (i, n)
    a[i] = a_[i];
  sort(q2 + 1, q2 + m2 + 1);
  int l = 1, r = 0, t = 0;
  re (i, m2) {
    while (t < q2[i].t) AddT(++t, l, r);
    while (t > q2[i].t) DelT(t--, l, r);
    while (l > q2[i].l) Add(--l);
    while (r < q2[i].r) Add(++r);
    while (l < q2[i].l) Del(l++);
    while (r > q2[i].r) Del(r--);
    ans[q2[i].id] = res;
  }
  re (i, m2)
    out(ans[i])('\n');
  return 0;
}
```

## 做法 2（AC）

我们发现做法 1 中的平衡树常数巨大，考虑换一种维护方式。

我们发现每种颜色最后一次出现和第一次出现之间的差值等于相邻出现次数对之间差值的总和。也就是说，我们可以维护每个前缀对答案造成的贡献。每加入一个下标为 $x$ 的数，则对答案的贡献为 $x-pre(x)$，其中 $pre(x)$ 代表 $x$ 的相同颜色前缀。我们可以用树状数组很方便的维护这个东西。

时间复杂度还是 $O(n^{\frac 5 3}\log n)$，但是这个 $\log$ 是树状数组的 $\log$，常数比平衡树小得多。本地随机数据 $n=10^5$ 只用了不到两秒就跑完了。

```cpp
void Add(int x) {
  if (pre[x]) bit.Add(pre[x], x - pre[x]);
}
void Del(int x) {
  if (pre[x]) bit.Add(pre[x], pre[x] - x);
}
void AddT(int x, int l, int r) {
  if (l <= q1[x].x && q1[x].x <= r) Del(q1[x].x);
  pre[q1[x].x] = q1[x].y;
  if (l <= q1[x].x && q1[x].x <= r) Add(q1[x].x);
}
void DelT(int x, int l, int r) {
  if (l <= q1[x].x && q1[x].x <= r) Del(q1[x].x);
  pre[q1[x].x] = q1[x].lst;
  if (l <= q1[x].x && q1[x].x <= r) Add(q1[x].x);
}

signed main() {
  in(n)(msum)(a, n), sz = pow(n, 2.0 / 3);
  int m1 = 0;
  re (i, n)
    st[i].insert(0), st[i].insert(n + 1), st[a[i]].insert(i);
  re (i, n)
    pre_[i] = pre[i] = *prev(st[a[i]].lower_bound(i)), suf[i] = *st[a[i]].upper_bound(i);
  re (i, msum) {
    int op = in(), x = in(), y = in();
    if (op == 1) {
      if (y == a[x]) continue;
      int p = *prev(st[y].lower_bound(x)), s = *st[y].upper_bound(x);
      st[a[x]].erase(x), a[x] = y, st[a[x]].insert(x);
      if (suf[x] != n + 1) pre[suf[x]] = pre[x], q1[++m1] = {suf[x], pre[suf[x]], x};
      if (pre[x]) suf[pre[x]] = suf[x];
      if (p) suf[p] = x;
      if (s != n + 1) q1[++m1] = {s, x, pre[s]}, pre[s] = x;
      q1[++m1] = {x, p, pre[x]};
      pre[x] = p, suf[x] = s;
    } else
      ++m2, q2[m2] = {x, y, m1, m2};
  }
  re (i, n)
    pre[i] = pre_[i];
  sort(q2 + 1, q2 + m2 + 1);
  int l = 1, r = 0, t = 0;
  re (i, m2) {
    while (t < q2[i].t) AddT(++t, l, r);
    while (t > q2[i].t) DelT(t--, l, r);
    while (l > q2[i].l) Add(--l);
    while (r < q2[i].r) Add(++r);
    while (l < q2[i].l) Del(l++);
    while (r > q2[i].r) Del(r--);
    ll res = bit.Ask(n) - bit.Ask(l - 1);
    ans[q2[i].id] = res;
  }
  re (i, m2)
    out(ans[i])('\n');
  return 0;
}
```
