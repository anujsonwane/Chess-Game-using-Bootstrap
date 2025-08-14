import java.util.ArrayList;
import java.util.List;

class test {
    public boolean hasSameDigits(String s) {
        char[] arr=s.toCharArray();
        int n=arr.length,left=arr[0]-'0',right=arr[n-1]-'0';
        for(int i=1;i<n-1;i++){
            left+=arr[i]-'0';
            if(i!=n-2)left+=arr[i]-'0';
            left%=10;
        }
        // left= left>arr[1] ? left-(arr[1]-'0') : -(left-(arr[1]-'0'));
        for(int i=n-2;i>=1;i--){
            right+=arr[i]-'0';
            if(i!=1)right+=arr[i]-'0';
            right%=10;
        }
        return left==right;
    }



    public static void main(String[] args) {
        test t = new test();
        System.out.println();
        System.out.println(t.hasSameDigits("3902"));
        System.out.println(t.hasSameDigits("34789"));
        System.out.println();
    }

}