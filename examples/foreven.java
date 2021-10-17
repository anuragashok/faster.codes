import java.util.*;

public class Main {
    public static void main(String args[]) {
        List<Integer> ints = new ArrayList<>();
        for(int i=0; i<=Math.pow(2,22);i++){
            ints.add(i);      
        }
        // actual code to test starts here
        List<Integer> even = new ArrayList<>();
        for(int i=0; i<ints.size(); i++){
            if(ints.get(i)%2==0){
                even.add(ints.get(i));
            }
        }
    }
}
