---
title: ACP 题解
tags: [题解]
uptime: 1625141916
---

## Task 1

交换 $a,b$ 两数。

三次异或解决。

```cpp
void Swap() { Xor(1), Xor(0), Xor(1); }
```

## Task 2

求 $a-b$，自然溢出。

由于负数在计算机内部以补码存储，所以 $a-b=a+(-b)=a+ (\sim b+1)$。这个问题就被转化成了 A+B Problem。我们可通过异或和与运算来模拟二进制进位加法。由于本题的整数是 $64$ 位的，所以我们最多进位 $64$ 次。

```cpp
void Add(int x, int cnt) {
  re(_, cnt) {
    Mov(x ^ 1);
    Xor(x ^ 1);
    Mov(x);
    And(x ^ 1);
    Lsh(x ^ 1, 1);
    Mov(x ^ 1);
    Swap();
    Mov(x);
    Xor(x);
    Pop(x ^ 1);
  }
  Pop(x ^ 1);
}

void Fu(int x) {
  Not(x);
  Not(x ^ 1);
  Rsh(x ^ 1, 63);
  Add(x, 64);
}

void St2() {
  Fu(0);
  Mov(0);
  Add(1, 64);
}
```

## Task 3

实现十进制整数快读。

既然我们已经实现加减法了，就可以写一个快读了。但是如果直接暴力减 $48$，暴力做十次加法当乘法的话，汇编指令长度会超限。这里有两个小技巧。

1. 当计算减 `0` 的 ASCII 码（即 $48$）的时候，我们发现 $[48,57]$ 内的整数在与 $48$ 做二进制减法时都不会「退位」。所以我们可以用一次异或运算来代替减法。
2. 在计算乘 $10$ 时，我们可以把 `x*=10` 转化为 `x+=x<<2;x<<1`。这样可以尽可能的减少加法运算。

```cpp
void St3() {
  int n = 9;
  re(i, n) {
    Not(1);
    Lsh(1, 62);
    Rsh(1, 58);  // 48
    Xor(0);      // -48
    Pop(1);
    if (i != 1) {
      Add(0, ceil(log2(2 * pow(10, i - 1))));
    }
    if (i != n) {
      // x*=10 -> x+=x<<2;x<<1
      Xor(1);
      Lsh(0, 2);
      Add(0, ceil(log2(pow(10, i))));
      Lsh(0, 1);
      Swap();  // 让最顶上变成 0
      Mov(0);
    }
  }
  Mov(0);
}
```

## Task 4

求 $(\operatorname{popcnt}x) \bmod 2$。

考虑二分，`x^=x>>32, x^=x>>16, x^=x>>8, ..., x^=x>>1`。答案为 $x \bmod 2$。

```cpp
void St4() {
  for (int i = 32; i; i >>= 1) {
    Xor(i == 32);
    Rsh(0, i);
    Xor(1);
    Pop(0);
  }
  Lsh(1, 63);
  Rsh(1, 63);
}
```

## Task 5

求 $\min\{a,b\}$。

考虑异或运算的性质。设 $t=a\oplus b$，则 $t$ 正好是 $a$ 与 $b$ 中**零一不同**的位。而将 $t\And a$ 得到的结果是这些不同的位中哪些位 $a$ 为 $1$。同理，$t\And a$ 得到哪些位 $b$ 为 $1$。我们只要比较 $t\And a$ 和 $t \And b$ 的大小关系，就可以得出 $a$ 和 $b$ 的大小关系。考虑拼一个运算符 $\operatorname{hibFill} x$。它的作用是将 $x$ 的第一个 $1$ 后的位全填充为 $1$。这样的话如果 $\operatorname{hibFill}(t\And a)\And \operatorname{hibFill}(t \And b)$ 不为零，则 $a>b$，否则 $a<b$。$\operatorname{hibFill}$ 的实现利用倍增思想，类似于 Task 4，只不过将左移改成了右移。具体实现请参考代码。

但是这样会略微有些超出指令长度范围，我们需要优化一下。可以发现 $t$ 与 $b$ 的运算是不必要的。我们可以直接比较 $t$ 的最高位是否在 $a$ 中，如果在则 $a>b$，否则 $a<b$。由于这题要求输出的是 $a,b$ 中较小者，所以我们怎么处理 $a=b$ 的情况都可以。

剩下的事情就好办了，考虑拼一个 $\operatorname{if}(con,a,b)$ 运算符，它的作用类似于 C++ 中的 `if(con)return b;else return a`。这样我们就能求出答案了。

```cpp
// 将第一个 1 后的位全填充为 1
void HibFill(int x) {
  for (int i = 32; i; i >>= 1) {
    Xor(x ^ 1);
    Rsh(x ^ 1, i);
    Or(x);
    Pop(x ^ 1);
  }
}

// 两数都在 S[0]
// pop S[0] 的两数并将比较结果放在原位置
// 输入 [b a] 输出 [a<b]
void Cmp() {
  Xor(1);  // [a b] [b]
  Mov(0);  // [a] [b b]
  Xor(1);  // [a] [b t]
  Mov(1);  // [a t] [b]
  Swap();  // [a b] [t]
  Mov(1);  // [a b t] []
  HibFill(0);
  Xor(1);
  Rsh(1, 1);
  Xor(0);
  Pop(1);  // [a b t] []
  Mov(0);  // [a b] [t]
  Pop(0);
  And(0);
  Pop(1);  // [a] []
  HibFill(0);
  for (int i = 1; i <= 32; i <<= 1) {
    Or(1);
    Lsh(1, i);
    Or(0);
  }
  Pop(1);
}

// [a b con]
// 输入至 S_x，pop x, pop x，输出至 S_x^1
// if(con) b; else a
void If(int x) {
  Mov(x);      // [a b] [con]
  Swap();      // [a con] [b]
  And(x ^ 1);  // [a con] [b&con]
  Not(x);      // [a !con] [b&con]
  Mov(x);      // [a] [b&con !con]
  And(x);      // [a&!con] [b&con !con]
  Pop(x ^ 1);  // [a&!con] [b&con]
  Or(x ^ 1);
  Pop(x);
}

void St5() {
  Xor(1);  // [a b] [b]
  Mov(0);  // [a] [b b]
  Mov(0);  // [] [b b a]
  Xor(0);  // [a] [b b a]
  Mov(1);  // [a a] [b b]
  Swap();  // [a b] [b a]
  Mov(1);  // [a b a] [b]
  Mov(1);  // [a b a b] []
  Cmp();
  If(0);
}
```

## Task 6

求 $a \times b \bmod p$。

我们现在有加法，有 `if`，我们就可以搞一个乘法了。由于 $a,b$ 的范围都在 `unsigned long long` 级别，我们考虑一个类似于快速幂的「快速乘」：

```cpp
(伪代码)
int ans=0;
for i=1...64 {
  if(a&1) ans+=b;
  a>>=1;
  b<<=1;
}
return ans;
```

仿照快速幂的思想，设 $b=2^{i_1}+2^{i_2}+\cdots+2^{i_k}$，根据乘法分配律，将 $a\times b$ 拆分成 $a\times 2^{i_1}+a\times 2^{i_2}+\cdots+a\times 2^{i_k}$。复杂度 $O(\log b)$。但是因为只能同时操纵两个栈的栈顶元素，我们需要不断的 `Swap()`。实际写起来有点麻烦。由于模数是 $2$ 的整数次幂，我们可以先自然溢出，最后再取模。

```cpp
// 乘法
// 在 S0 上输入 0,a,b; (pop 0)*3; out to S1
void Mul(int x, int cnt) {
  // [0 a b] []
  Xor(x ^ 1);  // [0 a b] [b]
  Mov(x);      // [0 a] [b b]
  Swap();      // [0 b] [b a]
  Mov(x ^ 1);  // [0 b a] [b]
  Swap();      // [0 b b] [a]
  re(k, cnt) {
    // [ans b b] [a]
    Mov(x ^ 1);
    Xor(x ^ 1);  // [ans b b a] [a]
    Mov(x ^ 1);
    Not(x ^ 1);
    Rsh(x ^ 1, 63);  // [ans b b a a] [1]
    And(x);
    Pop(x ^ 1);  // [ans b b a a&1] []
    for (int i = 1; i <= 32; i <<= 1) {
      Or(x ^ 1);
      Lsh(x ^ 1, i);
      Or(x);
    }
    Pop(x ^ 1);
    Mov(x);
    Mov(x);
    // [ans b b] [f a]
    Swap();      // [ans b a] [f b]
    Mov(x ^ 1);  // [ans b a b] [f]
    Swap();      // [ans b a f] [b]
    Mov(x ^ 1);  // [ans b a f b] []
    Mov(x);
    Mov(x);
    Mov(x);
    Mov(x);      // [ans] [b f a b]
    Swap();      // [b] [b f a ans]
    Mov(x ^ 1);  // [b ans] [b f a]
    Swap();      // [b a] [b f ans]
    Mov(x ^ 1);  // [b a ans] [b f]
    Swap();      // [b a f] [b ans]
    Mov(x ^ 1);  // [b a f ans] [b]
    Swap();      // [b a f b] [ans]
    Mov(x ^ 1);
    Xor(x ^ 1);  // [b a f b ans] [ans]
    Mov(x);      // [b a f b] [ans ans]
    Swap();      // [b a f ans] [ans b]
    Mov(x ^ 1);  // [b a f ans b] [ans]
    Swap();      // [b a f ans ans] [b]
    Add(x, 64);  // [b a f ans ans+b] []
    Mov(x);      // [b a f ans] [ans+b]
    Swap();
    Mov(x);
    Swap();
    Mov(x ^ 1);
    Swap();
    Mov(x ^ 1);
    Not(x);
    // [b a ans+b ans !f] []
    If(x);
    // [b a] [f?ans+b:ans]
    // [b a] [ans]
    if (k == cnt) {
      Pop(x);
      Pop(x);
    } else {
      Rsh(x, 1);
      Swap();
      Mov(x);
      Swap();
      // [ans] [a b]
      Lsh(x ^ 1, 1);
      Mov(x ^ 1);  // [ans b] [a]
      Swap();      // [ans a] [b]
      Mov(x ^ 1);
      Xor(x ^ 1);  // [ans a b] [b]
      Mov(x);
      Swap();
      Mov(x ^ 1);
      Swap();  // [ans b b] [a]
    }
  }
}

void St6() {
  Xor(1);
  Rsh(0, 64);
  Mov(0);
  Mov(0);
  Mov(0);
  Mul(1, 63);
  Mov(1);
  Rsh(0, 1);
  LowbitFill(0);
  Mov(0);
  And(1);
}
```

## Task 7

求 $\sqrt a$，满足答案是 $2$ 的整数次幂。

手推一下发现只有输入 $a$ 是 $2^0, 2^2, 2^4$ 等 $2$ 的偶数次方时才有合法答案。且 $a=2^k$ 时答案一定是 $2^{k/2}$。两位两位左移并判断即可。

```cpp
void St7() {
  ste(k, 0, 62, 2) {
    Not(1);
    Rsh(1, 63);
    Lsh(1, k);
    And(1);  // [a] [ans 1<<k]
    Rsh(1, k / 2);
    Mov(1);  // [a 1<<k/2] [ans]
    Or(1);
    if (k != 62) {
      Mov(0);
      Rsh(1, 64);  // [a] [ans 0]
    }
  }
}
```

## Task 8

求 $\gcd(a,b)$。

$\gcd(a,b)=\gcd(\max\{a,b\}-\min\{a,b\},\min\{a,b\})$。不断求最大最小值并相减，直到其中一数为 $0$。最差情况发生在 $a=63,b=1$ 时，需要减 $62$ 次。

```cpp
void St8() {
  int n = 62;
  re(k, n) {
    Xor(1);
    Mov(1);  // [a b b] []
    Xor(1);
    Mov(0);  // [a b] [b b]
    Mov(0);  // [a] [b b b]
    Mov(0);
    Xor(0);  // [a] [b b b a]
    Mov(1);  // [a a] [b b b]
    Xor(1);  // [a a] [b b a^b]
    Swap();  // [a a^b] [b b a]
    Mov(0);
    Swap();  // [a^b] [b b a a]
    Mov(1);
    Mov(1);  // [a^b a a] [b b]
    Swap();  // [a^b a b] [b a]
    Mov(1);
    Mov(1);  // [a^b a b a b] []
    Cmp(0);  // [a^b a b f]
    If(0);   // [a^b] [min]
    Xor(0);  // [max] [min]
    Mov(1);
    Xor(1);  // [max min] [min]
    Mov(1);
    Fu(0);  // [max min -min] []
    Mov(0);
    Swap();     // [max -min] [min]
    Mov(0);     // [max] [min -min]
    Add(1, 6);  // [] [min max-min]
    Not(0);
    Rsh(0, 58);
    And(1);
    Pop(0);
    Mov(1);
    if (k == n)
      Or(1);
    else
      Mov(1);
  }
}
```
