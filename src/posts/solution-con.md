---
title: CON 题解
tags: [题解]
uptime: 1613922777
---

## subtask 1

全排列暴力即可。

## subtask 2

由于任意两个字符串都没有公共前后缀，所以 $k$ 连串对答案的贡献全部产生在每个串的内部，换句话说，不论按什么顺序排列拼接得到的 $k$ 连串数量都是一样的。任意找一种排列算出答案再乘上 $n!$ 即可。

## subtask 3

每个串只有一个字母，且题目中规定 $k\ge 2$，所以我们只要枚举每种字母，计算在串中有多少种位置可能出现 $k$ 连串，将贡献求和即可。

设当前枚举的字母为 $c$，这 $n$ 个字符串中有 $\operatorname{cnt}(c)$ 个字符串为 $c$，则可能出现的 $k$ 连串的连续的 $k$ 个位置共有 $(n-k+1)$ 种。对于每种位置，在所有的全排列中，这个位置上全是 $c_i$ 的排列数有 $\operatorname{A}_{\operatorname{cnt}(c)}^k$ 种，而其它位置共有 $(n-k)!$ 种排列方式，这些位置如何排列都不会对答案产生影响。所以我们只要求出

$$
\sum_{c='a'}^{'z'} (n-k)!(n-k+1)\operatorname{A}_{\operatorname{cnt}(c)}^k
$$

的值即为答案。

## subtask 4

考虑将贡献分为两种——字符串内部的贡献和拼接处产生的贡献。第一种贡献的求出方法参考 subtask 2，重点是第二种。考虑一个有长度为 $i$ 的连续极大后缀的字符串和一个长度为 $j$ 的极大连续前缀的字符串相拼接。会对答案造成 $i+j-k+1$ 的贡献。我们可以预处理出有极大前缀为字符 $c$，长度为 $i$ 的字符串数量 $\operatorname{pre}(c,i)$，极大后缀为字符 $c$，长度为 $j$ 的字符串数量 $\operatorname{suf}(c,j)$。枚举 $c,i,j$，从两个集合各选出一个字符串拼接在一起的方案数为 $\operatorname{suf}(c,i)\operatorname{pre}(c,i)$。考虑将「所有的全排列中 $k$ 连串数量的总和」转化为「随机洗牌后 $k$ 连串数量的期望」。从 $n$ 个位置中选择两个位置共有 $\operatorname{C}_n^2 = n(n-1)$ 种方案。而这 $n(n-1)$ 种方案中只有 $(n-1)$ 种使得两个字符串正好相邻。也就是说，随机洗牌后这两个字符串正好相邻形成 $k$ 连串的概率为 $\dfrac{n-1}{n(n-1)}=\dfrac 1 n$。所以对答案的贡献为：

$$
\dfrac{\operatorname{suf}(c,i)\operatorname{pre}(c,i)(i+j-k+1)} n.
$$

但是这会忽略一种特殊情况，试想有这样一组数据：

```
-1
2 3 2
aba
cde
```

正确答案显然为 $0$，但是根据上面那种方式得到的答案为 $1$，原因是因为字符串 `aba` 的前后缀有相同的字符，计算答案时会「自己和自己拼接」而造成贡献，我们可以记录多少个字符串有着极大前后缀字符均为 $c$ 的，前缀长度为 $i$，后缀长度为 $j$ 的字符串数量 $\operatorname{same}(c,i,j)$，计算答案时减去即可。故最终答案为：

$$
\sum_{c='a'}^{'z'}\sum_{i=1}^{m-1}\sum_{j=1}^{m-1}\dfrac{(\operatorname{suf}(c,i)\operatorname{pre}(c,i)-\operatorname{same}(c,i,j))(i+j-k+1)} n.
$$

## Subtask 5&6

考虑将贡献分五种情况：

- 单个串内部；
- 纯由相同字母组成的串拼接；
- 一段后缀 + 几个相同字母组成的串；
- 几个相同字母组成的串 + 一段前缀；
- 一段后缀 + 几个相同字母组成的串 + 一段前缀。

分别考虑这些情况，计算答案即可。公式的推导与 subtask 4 类似，这里不再重复。

设 $G(i,j,k)$ 为后缀长度 $=i$，相同字母的串的个数 $=j$，前缀长度 $=k$ 对答案造成的贡献。需要注意的是，统计答案的时候可能会重复统计答案，比如当 $m=3,k=5$ 时。$G(2,1,1)=1$ 而不是 $2$，因为 $(2,1,1)$ 的情况包括 $(2,1,0)$ 的情况，会重复计算一遍贡献。具体来说，在计算 $G(x,y,z)$ 时，要减掉 $G(x,1\cdots y,0)$、$G(0,1\cdots y,z)$、$G(0,1\cdots y,z)$ 的贡献。贡献的计算可以通过一个简单 DP 求出，也可以分情况直接 $O(1)$ 判断。

```cpp
int Gx(int i, int ed, int st) {
  if (ed == 0 && st == 0) {
    int res = m + k - (i - 1) * m - 1;
    if (res > m) res = i * m - k + 1;
    if (res < 0) res = 0;
    return res;
  }
  if (ed == 0 || st == 0) {
    int j = ed | st;
    int res = j + k - 1 - (i - 1) * m - j;
    if (res > m) res = i * m + j - k + 1;
    if (res > j) res = j;
    if (res < 0) res = 0;
    return res;
  }
  int mn = min(st, ed), mx = max(st, ed);
  int res = mn + k - 1 - i * m - mn;
  if (res > mx) res = i * m + mn + mx - k + 1;
  if (res > mn) res = mn;
  if (res < 0) res = 0;
  return res;
}

signed main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  cin >> T >> n >> m >> k;
  jc[0] = jcinv[0] = 1;
  re (i, n)
    jc[i] = 1ll * jc[i - 1] * i % mo, jcinv[i] = Inv(jc[i]);
  re (i, n) {
    string s;
    cin >> s;
    int f = s[0], b = s.back();
    int l = s.find_first_not_of(f), r = m - s.find_last_not_of(b) - 1;
    f -= 'a', b -= 'a';
    if (l < 0)
      l = n, ++all[f];
    else {
      ++pre[f][l], ++suf[b][r];
      if (f == b) ++same[f][l][r];
    }
    int len = 1;
    rep (i, l, m - r - 1) {
      if (s[i] == s[i - 1])
        ++len;
      else
        len = 1;
      if (len >= k) ++ans;
    }
  }
  rep (c, 0, 25) {
    pre[c][0] = suf[c][0] = 1;
    rep (mid, 0, all[c]) {
      rep (ed, 0, m - 1) {
        rep (st, 0, m - 1) {
          int qw = Gx(mid, ed, st);
          if (qw <= 0) continue;
          int glx = (1ll * suf[c][ed] * pre[c][st] - same[c][st][ed] + mo) % mo * A(all[c], mid) %
                    mo * (n - mid + 1 - bool(st) - bool(ed)) % mo,
              gly = A(n, mid + bool(st) + bool(ed));
          ans += 1ll * qw * glx % mo * Inv(gly) % mo, umod(ans);
        }
      }
    }
  }
  cout << 1ll * ans * jc[n] % mo << '\n';
}

```
