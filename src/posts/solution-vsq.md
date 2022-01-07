---
title: VSQ 题解
tags: ["题解"]
uptime: 1622981614
---

## 题目大意

维护一个零一串，要求支持区间推平、区间反转，求区间最大零一交替子串长度和长度为 $k$ 的零一交替子串计数。

## Subtask 1

暴力遍历数组并修改 / 查询即可，复杂度 $O(nm)$。

## Subtask 2

留给莫队及一些玄学做法，代码略。

## Subtask 3

考虑分块。每块维护**块内**最长的「VS 串」的长度 $(lzmx)$、块左侧的极大「VS 串」长度 $(lzl)$、块右侧的极大「VS 串」长度 $(lzr)$、块内第一个数是什么 $(l1)$、块内最后一个数是什么 $(r1)$。

- 对于 $0\sim 1$ 操作，整块打一个推平懒标记，记录该块推平成了什么数，并清空该块上的所有标记；对于散块则暴力修改。

- 对于 $2$ 操作，整块如果已有推平标记，则将「推平成什么」标记零一反转；整块如果已有反转标记，则撤销反转标记；如果什么标记都没有，则打一个反转懒标记；对于散块则暴力修改。

- 对于 $4$ 操作，零散块暴力查询。对于整块，如果块 $B_l$ 与 $B_r$ 相邻，且 $r1(B_l)=l1(B_r)$，则我们可以将 $B_l$ 内部右侧的极大「VS 串」与 $B_r$ 内部左侧的极大「VS 串」拼接在一起形成一个更长的、长度为 $lzr(B_l)+lzl(B_r)$ 的「VS 串」。综上，$[l,r]$ 区间内的最长「VS 串」可能由「块内部的串」或「两个或多个块边界上的串拼接」得到，分别计算这两种情况即可。

复杂度 $O(n\sqrt n)$。

```cpp
// lzmx: 块内 (lbl ~ rbl) 最多连续 01 是多少个
// lzl: 块左端连续 01 是多少个
// lzr: 块右端连续 01 是多少个
// l1: 块的第一个元素是什么
// r1: 块的倒数第一个元素是什么
int bl[N], lbl[N], rbl[N], a[N], sz, n, m, fil[B], rev[B];
int lzmx[B], lzl[B], lzr[B], l1[B], r1[B];

void Down(int x) {
  int b = bl[x];
  assert((fil[b] != -1) + rev[b] <= 1);  // 同时只能一个标记
  if (fil[b] != -1) {
    rep(i, lbl[x], rbl[x]) a[i] = fil[b];
  }
  if (rev[b]) {
    rep(i, lbl[x], rbl[x]) a[i] ^= 1;
  }
  fil[b] = -1, rev[b] = 0;
}

void Up(int x) {
  int b = bl[x];
  l1[b] = a[lbl[x]];
  r1[b] = a[rbl[x]];
  // 计算 lzmx
  lzmx[b] = 1;
  int res = 1;
  rep(i, lbl[x], rbl[x] - 1) {
    if (a[i] != a[i + 1])
      ++res;
    else {
      up(lzmx[b], res), res = 1;
    }
  }
  up(lzmx[b], res);
  // 计算 lzl & lzr
  lzl[b] = lzr[b] = 1;
  rep(i, lbl[x], rbl[x] - 1) {
    if (a[i] != a[i + 1])
      ++lzl[b];
    else
      break;
  }
  per(i, rbl[x], lbl[x] + 1) {
    if (a[i] != a[i - 1])
      ++lzr[b];
    else
      break;
  }
}

void Fil(int l, int r, int x) {
  if (bl[l] == bl[r]) {
    Down(l);
    rep(i, l, r) a[i] = x;
    Up(l);
    return;
  }
  Fil(l, rbl[l], x);
  rep(i, bl[l] + 1, bl[r] - 1) fil[i] = x, rev[i] = 0,
                               lzmx[i] = lzl[i] = lzr[i] = 1, l1[i] = r1[i] = x,
                               lzs[i].clear(), lzhzh[i].clear();
  Fil(lbl[r], r, x);
}

void Rev(int l, int r) {
  if (bl[l] == bl[r]) {
    Down(l);
    rep(i, l, r) a[i] ^= 1;
    Up(l);
    return;
  }
  Rev(l, rbl[l]);
  rep(i, bl[l] + 1, bl[r] - 1) {
    // 这个块之前被填充过
    // 一个块上最多打一种标记
    if (fil[i] != -1) {
      fil[i] ^= 1;
    } else {
      // 打上翻转标记
      rev[i] ^= 1;
    }
    // lz、lzmx、lzl、lzr、lzs、lzhzh 不变
    l1[i] ^= 1, r1[i] ^= 1;
  }
  Rev(lbl[r], r);
}

int Ask2(int l, int r) {
  if (bl[l] == bl[r]) {
    Down(l);
    int res = 1, mx = 1;
    rep(i, l, r - 1) {
      if (a[i] != a[i + 1])
        ++res;
      else
        up(mx, res), res = 1;
    }
    up(mx, res);
    return mx;
  }
  int mx = Ask2(l, rbl[l]), tail = min(lzr[bl[l]], rbl[l] - l + 1);
  rep(i, bl[l] + 1, bl[r] - 1) {
    up(mx, lzmx[i]);
    // 不能拼接
    if (r1[i - 1] == l1[i]) tail = 0;
    tail += lzl[i], up(mx, tail);
    // 没有整块全是 VS 串
    if (lzl[i] != sz) tail = lzr[i];
  }
  if (r1[bl[r] - 1] == l1[bl[r]]) tail = 0;
  tail += min(lzl[bl[r]], r - lbl[r] + 1), up(mx, tail);
  up(mx, Ask2(lbl[r], r));
  return mx;
}
```

## Subtask 4

由于本 subtask 的特殊性，此 subtask 内的数据会出现大量推平操作、我们可以使用 ODT 等玄学数据结构达到 $O(n\log n)$ 的复杂度。代码实现类似 subtask 1，暴力扫一遍即可。

## Subtask 5

由于 $k=3$，问题变成了「求有多少个位置 $p$ 满足 $a_{p-1} \ne a_p$ 且 $a_{p+1}\ne a_p$」。和 subtask 3 类似，考虑分块，我们额外维护几个标记：

- 标记 $lz(B_x)$ 表示 $p-1,p,p+1$ 全在 $B_x$ 块内的符合要求的位置 $p$ 总数。
- 标记 $l2(B_x)$ 表示块内从左往右数第二个元素是什么。
- 标记 $r2(B_x)$ 表示块内从右往左数第二个（即倒数第二个）元素是什么。

对于两种修改操作，我们也需要进行更改：

- 对于推平操作，块内 $lz$ 变为零。
- 对于反转操作，块内 $lz$ 不变。

查询时只要将个块内 $lz$ 累加，然后计算两块相接处的位置对答案的贡献即可，复杂度 $O(n\sqrt n)$。

```cpp
// 检查是否构成 010 / 101
// 前两个元素在当前的块里，后一个在右边的块里
inline bool Check21(int x) {
	int b1 = bl[x], b2 = bl[x] + 1;
	return r1[b1] != r2[b1] && r1[b1] != l1[b2];
}

// 检查是否构成 010 / 101
// 前一个元素在当前的块里，后两个在右边的块里
inline bool Check12(int x) {
	int b1 = bl[x], b2 = bl[x] + 1;
	return l1[b2] != r1[b1] && l1[b2] != l2[b2];
}

int Ask1(int l, int r) {
	int res = 0;
	if (bl[l] == bl[r] || l >= r) {
		Down(l);
		// 如果询问块的左边界，需要加上前一个块的 Check12
		if (l != 1 && l == lbl[l]) res += Check12(l - 1), ++l;
		// 如果询问块的右边界，需要加上最后一个块的 Check21
		if (r != n && r == rbl[r]) res += Check21(r), --r;
		rep (i, l, r) {
			if (i > 1 && i < n && a[i - 1] != a[i] && a[i + 1] != a[i]) {
				++res;
			}
		}
		return res;
	}
	// 处理块内部的 010 / 101
	res += Ask1(l, rbl[l] - 1);
	rep (i, bl[l] + 1, bl[r] - 1) { res += lz[i]; }
	res += Ask1(lbl[r] + 1, r);
	// 处理边角
	ste(i, lbl[l], lbl[r - sz], sz) {
		res += Check12(i);
		res += Check21(i);
	}
	return res;
}
```

## Subtask 6

和 subtask 3 类似，考虑分块，我们额外维护几个标记：

- $lzs(B_x)$ 表示块 $B_x$ 中的极大 VS 串长度排序后的结果。

- $lzhzh(B_x)$ 表示 $lzs(B_x)$ 的后缀和。

每次查询 $3$ 操作，我们就可以在每个块内进行二分。复杂度 $O(n \sqrt n \log \sqrt n)$。

```cpp
void Up(int x) {
  int b = bl[x];
  l1[b] = a[lbl[x]];
  r1[b] = a[rbl[x]];
  // 计算 lzmx & lzs
  lzmx[b] = 1;
  lzs[b].clear();
  int res = 1;
  rep(i, lbl[x], rbl[x] - 1) {
    if (a[i] != a[i + 1])
      ++res;
    else {
      // 只保留长度 >= 3 的
      if (res >= 3) lzs[b].push_back(res);
      up(lzmx[b], res), res = 1;
    }
  }
  up(lzmx[b], res);
  if (res > 1) lzs[b].push_back(res);
  // 计算 lzl & lzr
  lzl[b] = lzr[b] = 1;
  rep(i, lbl[x], rbl[x] - 1) {
    if (a[i] != a[i + 1])
      ++lzl[b];
    else
      break;
  }
  per(i, rbl[x], lbl[x] + 1) {
    if (a[i] != a[i - 1])
      ++lzr[b];
    else
      break;
  }
  sort(lzs[b].begin(), lzs[b].end());
  // 计算 lzhzh
  lzhzh[b].clear();
  int sum = 0;
  per(i, lzs[b].size() - 1, 0) {
    sum += lzs[b][i];
    lzhzh[b].push_back(sum);
  }
  reverse(lzhzh[b].begin(), lzhzh[b].end());
}

// 修改操作省略

int Ask1(int l, int r, int k) {
  if (bl[l] == bl[r] || l >= r) {
    Down(l);
    int res = 1, cnt = 0;
    rep(i, l, r - 1) {
      if (a[i] != a[i + 1]) {
        ++res;
        if (res >= k) ++cnt;
      } else
        res = 1;
    }
    return cnt;
  }
  int cnt = Ask1(l, rbl[l], k), tail = min({lzr[bl[l]], rbl[l] - l + 1, k - 1});
  rep(i, bl[l] + 1, bl[r] - 1) {
    auto it = lower_bound(lzs[i].begin(), lzs[i].end(), k);
    if (it != lzs[i].end())
      cnt += *(it - lzs[i].begin() + lzhzh[i].begin()) -
             (lzs[i].end() - it) * (k - 1);
    // 不能拼接
    if (r1[i - 1] == l1[i]) tail = 0;
    tail += min(lzl[i], k - 1), cnt += max(0, tail - k + 1);
    // 没有整块全是 VS 串
    if (lzl[i] != sz) tail = lzr[i];
    down(tail, k - 1);
  }
  if (r1[bl[r] - 1] == l1[bl[r]]) tail = 0;
  tail += min({lzl[bl[r]], r - lbl[r] + 1, k - 1}), cnt += max(0, tail - k + 1);
  cnt += Ask1(lbl[r], r, k);
  return cnt;
}
```

~~什么？你需要完整代码？把 subtask 3 和 6 的代码拼起来改一改就好了。~~
