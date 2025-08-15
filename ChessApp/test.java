import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

class test {
    public int ans=0;
    public static int[][] dir={{-1,1},{1,1},{1,-1},{-1,-1}};
    public int lenOfVDiagonal(int[][] grid) {
        int m=grid.length,n=grid[0].length;
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(grid[i][j]==1){
                    checkPossibility(grid,i,j,1,true,4);
                    System.out.println("Starting from (" + i + "," + j + ") with initial value 1");
                }
            }
        }
        return ans;
    }
    public void checkPossibility(int[][] grid,int i,int j,int pos,boolean turn,int direction){
        if(direction != 4){
            int x=i+dir[direction][0];
            int y=j+dir[direction][1];
            int digit= (pos%2)==0 ? 0 : 2 ;
            if(x<0 || y<0 || x>=grid.length || y>=grid[0].length || digit!=grid[x][y]){
                ans=Math.max(ans,pos);
                return;
            }
            
            checkPossibility(grid,x,y,pos+1,turn,direction);
            if(turn && direction==0){
                checkPossibility(grid,x,y,pos+1,false,1);
            }else if(turn && direction==1){
                checkPossibility(grid,x,y,pos+1,false,2);
            }else if(turn && direction==2){
                checkPossibility(grid,x,y,pos+1,false,3);
            }else if(turn && direction==3){
                checkPossibility(grid,x,y,pos+1,false,0);
            }
            return;
        }

        //FOR ITERATING THROUGH ALL THE DIRECTIONS
        for(int d=0;d<dir.length;d++){
            int x=i+dir[d][0];
            int y=j+dir[d][1];
            if(x<0 || y<0 || x>=grid.length || y>=grid[0].length) continue;
            int digit= (pos%2)==0 ? 0 : 2 ;
            if(grid[x][y]==digit){
                
                checkPossibility(grid,x,y,pos+1,true,d);
                if(turn && d==0){
                    checkPossibility(grid,x,y,pos+1,false,1);
                }else if(turn && d==1){
                    checkPossibility(grid,x,y,pos+1,false,2);
                }else if(turn && d==2){
                    checkPossibility(grid,x,y,pos+1,false,3);
                }else if(turn && d==3){
                    checkPossibility(grid,x,y,pos+1,false,0);
                }
            }
        }
        ans=Math.max(ans,pos);
    }


    public static void main(String[] args) {
        test t = new test();
        int[][] grid= {{2,1,2,2},{2,0,1,0},{2,2,2,2},{0,0,0,0},{2,2,2,2}};
        System.out.println("Input Grid:");
        for (int[] row : grid) {
            System.out.println(Arrays.toString(row));
        }   
        int result = t.lenOfVDiagonal(grid);
        System.out.println();
        System.out.println("Length of V-Diagonal: " + result);
        System.out.println("Maximum Length Found: " + t.ans);
        System.out.println();
    }

}