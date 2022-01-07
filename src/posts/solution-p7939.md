{"title":"P7939 题解","tags":["题解"],"uptime":1636685455}
---
对于 easy version，有一个显然的结论：最优方案一定能使 A 队每一局都赢。

- 对于前 $n$ 个人，通过修改 $a$ 数组使得 A 队全胜，这样可以保证对于 $a$ 数组的修改至多为 $n$ 次；
- 对于后 $n$ 个人，通过修改 $b$ 数组使得 A 队全胜，这样可以保证对于 $b$ 数组的修改至多为 $n$ 次。

```cpp
int a[N], b[N], n, T;
signed main() {
  in(T); while(T--){
    in(n)(a, 2 * n)(b, 2 * n);
    out(2 * n)('\n');
    re (i, n)
      out((b[i] - 2 + 3) % 3 + 1)(' ');
    rep (i, n + 1, 2 * n)
      out(a[i])(' ');
    out('\n');
    re (i, n)
      out(b[i])(' ');
    rep (i, n + 1, 2 * n)
      out(a[i] % 3 + 1)(' ');
    out('\n');
  }
  return 0;
}
```