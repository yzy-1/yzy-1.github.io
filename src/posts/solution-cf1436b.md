{"title":"CF1436B 题解","tags":["题解"],"uptime":1604411065}
---
刚开始做这道题的时候, 我是没有任何思路, 直到出题人发送了这样一条提示:

> I just want to remind you that:
>
> Smallest non-negative integers are $0, 1, 2, 3, \cdots$
>
> Smallest prime numbers are $2, 3, 5, 7, \cdots$

我这才意识到, 组成质方的数是 *非负数* 而并非整数, 即可以用 $0$.
那这题就变简单了, 我们可以只用 $0$ 和 $1$ 来填充这个矩阵.

先考虑一下小点的 $n$, 比如 $n = 10$.
由于 $2$ 是一个质数, 我们可以把 $(1, 1), (1, 2), (2, 1), (2, 2)$ 填充为 $1$,
第 $1, 2$ 行和第 $1, 2$ 列的其他格子填充 $0$, 这样这两行两列的和就都是 $2$,
符合条件了.

![](https://cdn.luogu.com.cn/upload/image_hosting/7vda3nu6.png)

接下来, 由于 $1,2$ 两行两列已经被填充完成了, 我们不能再去动这两行,
如果我们希望把 $3,4$ 两行也变成 $2$,
最简单的方法就是把 $(3, 3), (3, 4), (4, 3), (4, 4)$ 填充为 $1$,
这样就可以满足 $3,4$ 两行两列的条件了.

![](https://cdn.luogu.com.cn/upload/image_hosting/abjdwkry.png)

接下来如法炮制, 填充 $5,6$ 行, $7,8$ 行和 $9,10$ 行, 矩阵就完成了.

![](https://cdn.luogu.com.cn/upload/image_hosting/4z8e318w.png)

上面的方法只针对与 $n \bmod 2 = 0$, 即 $n$ 为偶数的情况, 那如果 $n$ 等于奇数, 就会出现下图的情况, 最后一行凑不成质数, 而其他格子都已被填充, 这该怎么办呢?

![](https://cdn.luogu.com.cn/upload/image_hosting/zvekdkxm.png)

这也很简单, 因为 $3$ 也是一个质数,
我们只需把在 $1 \sim n - 3$ 行列的格子按照上面的方法填充,
最后把坐标为 $(n - 3, n - 3) \sim (n, n)$ 填充为 $1$ 即可.

![](https://cdn.luogu.com.cn/upload/image_hosting/elh2xdlz.png)
