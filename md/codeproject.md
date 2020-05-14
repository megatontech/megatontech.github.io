#笔试题碎碎念

>markdown文本格式参考
##2标题
==============
###3标题
-------------
> 区块引用
* 第一项
* 第二项
+ 第一项
+ 第二项
- 第一项
- 第二项
. 第一项
. 第二项

##第一题
```C#
        public string solution(string S, int K)
        {
            var result = "";
            Dictionary<string, int> dic = new Dictionary<string, int>();
            dic.Add("Mon", 1);
            dic.Add("Tue", 2);
            dic.Add("Wed", 3);
            dic.Add("Thu", 4);
            dic.Add("Fri", 5);
            dic.Add("Sat", 6);
            dic.Add("Sun", 7);
            int current = 1;
            dic.TryGetValue(S, out current);
            var resultVal = 0;
            resultVal = current + K;
            resultVal = resultVal % 7;
            result = dic.FirstOrDefault(x => x.Value == resultVal).Key;
            return result;
        }
```

##第二题
```C#
        public static int solution(int[] A)
        {
            var result = 0;
            //store length between A numbers
            int[] length = new int[A.Length - 1];
            Array.Sort(A);
            var curr = 0;
            for (int i = 0; i < A.Length; i++)
            {
                if (i + 1 < A.Length)
                {
                    curr = A[i + 1] - A[i];
                    length[i] = curr;
                }
            }
            result = Convert.ToInt32(Math.Round((double)length.Max() / 2));
            return result;
        }
```
##第三题
```C#
        public static int solution(int[] A, int K)
        {
            var result = -1;
            Array.Sort(A);
            //只选一个并且没有偶数
            if ((K == 1 && A.All(x => x % 2 == 1)) || (K > A.Length))
            { return result; }
            else
            {
                if (K == A.Length)//全选
                { result = A.Sum(); }
                else //正常情况
                {
                    var tempResult = 0;
                    var offsetK = A.Length - K;
                    for (int i = A.Length - 1; i >= K - 1; i--)
                    {
                        tempResult += A[i];
                    }
                    if (tempResult % 2 == 1) //和为奇数
                    {   //把前 K 个中最小的奇数换成后面 N - K 个中最大的偶数 把前 K 个中最小的偶数换成后面 N - K 个中最大的奇数
                        int tempResultEven, tempResultOdd = 0;
                        tempResultOdd = (tempResult
                                            - (A.Skip(offsetK).Take(K).Where(x => x % 2 == 1).Any() ? A.Skip(offsetK).Take(K).Where(x => x % 2 == 1).Min() : tempResult)
                                               + (A.Take(offsetK).Where(x => x % 2 == 0).Any() ? A.Take(offsetK).Where(x => x % 2 == 0).Max() : 0));
                        tempResultEven = (tempResult
                                            - (A.Skip(offsetK).Take(K).Where(x => x % 2 == 0).Any() ? A.Skip(offsetK).Take(K).Where(x => x % 2 == 0).Min() : tempResult)
                                               + (A.Take(offsetK).Where(x => x % 2 == 1).Any() ? A.Take(offsetK).Where(x => x % 2 == 1).Max() : 0));
                        result = tempResultOdd > tempResultEven ? tempResultOdd : tempResultEven;
                    }
                    else
                    { result = tempResult; }
                }
            }
            return result;
        }
```


—
|  Task No   | Correctness  |Performance | Aggregated  | 
|  ----   | ----  | ----  | ----  |
| Task 1  | 75% |75% |N/A |
| Task 2  | 54% |20% |83% |
| Task 3  | 0% | | |