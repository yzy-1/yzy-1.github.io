{"title":"解决 AUR 下载软件包慢的问题","tags":["linux"],"uptime":1606217183}
---
`yay` 在安装 AUR 源的软件时会自动调用 `makepkg` 来打包软件包，而 `/etc/makepkg.conf` 是 `makepkg` 的配置文件，这个文件默认长这个样子（节选）：

```yaml
# ...
#-- The download utilities that makepkg should use to acquire sources
#  Format: 'protocol::agent'
DLAGENTS=('file::/usr/bin/curl -gqC - -o %o %u'
          'ftp::/usr/bin/curl -gqfC - --ftp-pasv --retry 3 --retry-delay 3 -o %o %u'
          'http::/usr/bin/curl -gqb "" -fLC - --retry 3 --retry-delay 3 -o %o %u'
          'https::/usr/bin/curl -gqb "" -fLC - --retry 3 --retry-delay 3 -o %o %u'
          'rsync::/usr/bin/rsync --no-motd -z %u %o'
          'scp::/usr/bin/scp -C %u %o')
# ...
```

为什么要用慢的要死的 `curl` 呢？为什么不用一个多线程的下载工具呢？我搜了一些大佬的博客，有换成 `aria2` 的，我选择了参数更加清爽的 `axel`。

```yaml
DLAGENTS=('file::/usr/bin/curl -gqC - -o %o %u'
          'ftp::/usr/bin/axel -n 15 -a -o %o %u'
          'http::/usr/bin/axel -n 15 -a -o %o %u'
          'https::/usr/bin/axel -n 15 -a -o %o %u'
          'rsync::/usr/bin/rsync --no-motd -z %u %o'
          'scp::/usr/bin/scp -C %u %o')
```

然而，`github` 上的软件包用的是亚马逊云，在国内似乎被墙了，不管多少个线程都下不动，所以我们还需要一点特殊优化。

既然能把 `curl` 换成 `axel`，那么能不能换成一个我们自己定义的脚本呢？于是我在 `/usr/local/bin/` 下面新建了一个脚本 `fake_axel_for_makepkg`： 

```bash
#!/bin/bash

domin=`echo $2 | cut -f3 -d'/'`;
others=`echo $2 | cut -f4- -d'/'`;

    url=$2;
    /usr/bin/axel -n 15 -a -o $1 $url;
    exit
case "$domin" in 
    "github.com")
    url="https://ghproxy.com/"$2;
    echo "download from github mirror $url";
    /usr/bin/curl -gqb "" -fLC - --retry 3 --retry-delay 3 -o $1 $url;
    ;;
    *)
    url=$2;
    /usr/bin/axel -n 15 -a -o $1 $url;
    ;;
esac
```

然后把 `makepkg.conf` 改成：

```yaml
DLAGENTS=('file::/usr/bin/curl -gqC - -o %o %u'
          'ftp::/usr/bin/axel -n 15 -a -o %o %u'
          'http::/usr/local/bin/fake_axel_for_makepkg %o %u'
          'https::/usr/local/bin/fake_axel_for_makepkg %o %u'
          'rsync::/usr/bin/rsync --no-motd -z %u %o'
          'scp::/usr/bin/scp -C %u %o')
```

这样下载速度就上来了。