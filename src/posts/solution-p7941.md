---
title: P7941 题解
tags: ["题解"]
uptime: 1636685479
---

首先考虑什么样的表达式是一个结果一定为 $0$，什么样的一定为 $1$，什么样的既可以为 $0$ 也可以为 $1$。

- 如果运算符为 `?`，则如果左操作数和右操作数确定且相同，则结果一定为左操作数。否则结果可以是 $0$ 或 $1$。
- 如果运算符为 `&`，且左右操作数中至少有一个确定为 $0$，则结果一定为 $0$。否则如果两个操作数均确定，则结果为两操作数按位与的结果。否则结果可以是 $0$ 或 $1$。
- 如果运算符为 `|`，且左右操作数中至少有一个确定为 $1$，则结果一定为 $1$。否则如果两个操作数均确定，则结果为两操作数按位或的结果。否则结果可以是 $0$ 或 $1$。

我们可以先建立出表达式树，从叶子节点到根节点依次转移即可。

```cpp
char s[N], typ[N];
int n, ls[N], rs[N], tp, ans[N];

inline int And(int x, int y) { return (x == 0 || y == 0) ? 0 : max(x, y); }
inline int Or(int x, int y) { return (x == 1 || y == 1) ? 1 : max(x, y); }

int Dfs(int x) {
  if (x <= 0) return -x;
  int l = Dfs(ls[x]), r = Dfs(rs[x]);
  if (typ[x] == '&') return ans[x] = And(l, r);
  if (typ[x] == '|') return ans[x] = Or(l, r);
  return ans[x] = ((And(l, r) == Or(l, r)) ? And(l, r) : 2);
}

signed main() {
  int T;in(T);while(T--) {
    vector<int> vec;
    in(n)(s + 1);
    re (i, n) {
      if (s[i] == '0' || s[i] == '1')
        vec.push_back(-(s[i] - '0'));
      else
        typ[++tp] = s[i], ls[tp] = vec.back(), vec.pop_back(), rs[tp] = vec.back(), vec.back() = tp;
    }
    Dfs(tp);
    int res = 0;
    re (i, tp)
      if (ans[i] == 2) ++res;
    out(res)('\n');
    rep (i, 0, n + 1)
      s[i] = 0, typ[i] = 0, ls[i] = 0, rs[i] = 0, ans[i] = 0;
    tp = 0, n = 0;
  }
  return 0;
}
```
