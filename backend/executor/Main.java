import java.util.*;
import java.math.BigInteger;

public class Main {
    public static void main(String args[]) {
        BigInteger fact=BigInteger.valueOf(1);
        for(int i=1;i<=10000;i++){    
            fact=fact.multiply(BigInteger.valueOf(i));   
        }
        System.out.println(fact);
    }
}