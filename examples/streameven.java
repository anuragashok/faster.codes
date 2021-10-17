import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String args[]) {
        List<Integer> ints = new ArrayList<>();
        for(int i=0; i<=Math.pow(2,22);i++){
            ints.add(i);      
        }
        // actual code to test starts here
        List<Integer> even = ints.parallelStream().filter(i -> i%2==0).collect(Collectors.toList());
    }
}
