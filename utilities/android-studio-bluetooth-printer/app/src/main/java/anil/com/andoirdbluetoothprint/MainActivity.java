package anil.com.andoirdbluetoothprint;

/**
 *.working for all thermal printer
 */

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import android.app.Activity;
import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.EditText;

public class MainActivity extends Activity {
    protected static final String TAG = "TAG";
    private static final int REQUEST_CONNECT_DEVICE = 1;
    private static final int REQUEST_ENABLE_BT = 2;
    private ProgressDialog mBluetoothConnectProgressDialog;
    private StringBuffer printText = new StringBuffer() ;
    private String printFinal = "";
    private static final String NEW_LINE_SYMBOL = "&&";
    BluetoothAdapter mBluetoothAdapter;
    BluetoothDevice mBluetoothDevice;
    BluetoothSocket mBluetoothSocket;
    OutputStream outputStream;
    InputStream inputStream;
    Thread thread;
    byte[] readBuffer;
    int readBufferPosition;
    volatile boolean stopWorker;
    private EditText receiptText ;
    TextView lblPrinterName;
    private List<String> params = new ArrayList<String>();

    @Override
    public void onResume() {
        super.onResume();
        try{
            updateReceiptText();
        } catch (Exception ex) {
            Log.e(TAG, "Receipt failed", ex);
        }
    }

    @Override
    public void onCreate(Bundle mSavedInstanceState) {
        super.onCreate(mSavedInstanceState);
        setContentView(R.layout.activity_main);
        Toast.makeText(getApplicationContext(),"Please ensure that the printer is on.",Toast.LENGTH_LONG).show();

        Button mPrint = (Button) findViewById(R.id.mPrint);
        receiptText = ((EditText) findViewById(R.id.printerText));

        mPrint.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View mView) {
                try{
                     findBluetoothDevice();
                     openBluetoothPrinter();
                     printData();
                }catch(Exception ex){
                    Log.e(TAG, "Printing Data Failed", ex);
                }
            }
        });
    }

    void findBluetoothDevice(){
        try{
            mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            if (mBluetoothAdapter == null)
                Toast.makeText(MainActivity.this, "No Bluetooth Found", Toast.LENGTH_SHORT).show();
            if(mBluetoothAdapter.isEnabled()) {
                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                startActivityForResult(enableBtIntent,0);
            }
            Set<BluetoothDevice>  pairedDevices = mBluetoothAdapter.getBondedDevices();
            if(pairedDevices.size()>0){
                for(BluetoothDevice  bluetoothDevice : pairedDevices) {
                    Log.v(TAG, "Coming bluetooth address " + bluetoothDevice.getName());
                    if (bluetoothDevice.getName().equals("MTP-II")) {
                        mBluetoothDevice = bluetoothDevice;
                        Toast.makeText(MainActivity.this, "DeviceConnected", Toast.LENGTH_SHORT).show();
                        break;
                    } else
                        Toast.makeText(MainActivity.this, "Couldn't Connect to device", Toast.LENGTH_SHORT).show();
                }
            }
        }catch (Exception ex){
            Toast.makeText(getApplicationContext(),"Exception while finding bluetooth printer --"+ex.getMessage(),Toast.LENGTH_LONG).show();
        }
    }

    void openBluetoothPrinter() throws IOException{
        try{
            UUID uuidString = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
            mBluetoothSocket = mBluetoothDevice.createRfcommSocketToServiceRecord(uuidString);
            mBluetoothSocket.connect();
            outputStream = mBluetoothSocket.getOutputStream();
            inputStream = mBluetoothSocket.getInputStream();
         }catch(Exception ex){
            Log.e(TAG, "Bluetooth connection failed", ex);
        }
    }

    void printData() throws  IOException{
            try{
                String msg = receiptText.getText().toString();
                if(!msg.isEmpty()) {
                    msg += "\n";
                    outputStream.write(msg.getBytes());
                }
            }catch(Exception ex){
                Toast.makeText(getApplicationContext(),"Exception while printing the data --"+ex.getMessage(),Toast.LENGTH_LONG).show();
            }
    }

   private void updateReceiptText() {
        Uri data = getIntent().getData();
        params = data.getPathSegments();
        printText=new StringBuffer("");
        for(String str:params)
        {
            printText.append(str).append('/');
        }
        printText.deleteCharAt(printText.length()-1);
        printFinal = printText.toString().replace(NEW_LINE_SYMBOL, "\n");
        if (printFinal != null)
            receiptText.setText(printFinal);
    }

}
