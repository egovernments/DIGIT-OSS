package org.egov.pg.service.gateways.nic;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Epayment {
	private String ApplicationNumber;
	private String GRN;
	private String Status;
	private Date Valid_Upto;
	private String Paymenttype;
	private String Amount;
	private String CIN;
	private String BankCode;
	private Date Transaction_date;

}
