{"title":"brackets 题解","tags":["题解"],"uptime":1634641444}
---
考虑到最优构造方案一定是把所有括号序列尽可能的构造成 `()`，考虑贪心，对于每一个左括号，寻找到它后面未被匹配的第一个右括号，进行匹配即可。

在整个串都匹配完成后，如果得到的 `()` 串组数 $\ge m$，则说明有合法的构造方案，否则说明没有。

至于时间复杂度，如果你是对于每个左括号，暴力寻找它右边的第一个没匹配的右括号，则复杂度为 $O(Tn^2)$。当然，你也可以使用一个 `queue` 来将复杂度优化为 $O(n)$，但是介于此题的数据范围，没有优化的必要。

```cpp
char s[100005];
int n, m, T;

signed main() {
  in(T);
  while(T--) {
    queue<int> q;
    in(n)(m)(s + 1);
    re (i, n)
      if (s[i] == ')') q.push(i);
    int ans = 0;
    re (i, n)
      if (s[i] == '(') {
        while (q.size() && q.front() < i) q.pop();
        if (q.size()) ++ans, q.pop();
      }
    out(ans >= m ? "1\n" : "0\n");
  }
  return 0;
}
```
