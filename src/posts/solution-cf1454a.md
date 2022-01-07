{"title":"CF1454A 题解","tags":["题解"],"uptime":1606531638}
---
题目大意
---

共 $t (1\le t\le100)$ 组数据, 对于每组数据输入一个整数 $n (2 \le n \le 100)$,
输出一个 $1\sim n$ 的排列 $p$ 使得 $p_i \ne i$,
如果有多种排列可以满足需求则任意输出一种.

做法
--

我们可以以如下方式生成这个排列:

$$p_i=\begin{cases}
1 & \text{if }i=n\\
i + 1 & \text{otherwise}
\end{cases}$$

Code
---

```cpp
while (t--){
  scanf("%d",&n);
  for (int i=1;i<n;++i) printf("%d ",i+1);
  puts("1");
}
```