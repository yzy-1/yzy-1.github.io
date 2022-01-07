{"title":"CF1514B 题解","tags":["题解"],"uptime":1618892763}
---
最佳情况是 $n$ 个数的 $k$ 个二进制位中，每一位都是 $n-1$ 个数为 $1$，$1$ 个为 $0$。

那么问题就变成了：一共有 $k$ 个位置，每个位置都要选一个 $1\sim n$ 的数，问有多少选择方案。答案为 $n^k$，快速幂计算即可。

复杂度：$O(\log k)$。

### Code:

```cpp
#define int ll

ll pow(ll a,ll b,const ll&m) {
	ll res=1;a%=m;
	while(b>0) {
		if(b&1)res=res*a%m;a=a*a%m,b>>=1;
	}
	return res;
}
 
const int mo = 1e9 + 7;
 
int n, k;
 
signed main() {
	re (_, in()) {
		in(n)(k);
		outl(pow(n, k, mo));
	}
	return 0;
}
```