/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any Long of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.egf.master.domain.model;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.common.domain.model.Auditable;
import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 
 * @author mani
 *
 */

/*
 * Account head is mandatory for every financial transaction for appropriate
 * classification, balancing as well as reporting. Chart of accounts classified
 * in to 3 categories, i.e Major Head, Minor Head and Detailed Head . The same
 * structure created for storing of Chart of Accounts in Finance Module.The
 * Chart of Accounts are maintained centrally for better control and pass on the
 * best practices evenly to all ULBs across the State.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(exclude = { "accountCodePurpose", "parentId" }, callSuper = false)
public class ChartOfAccount extends Auditable {

	/**
	 * id is the Unique Identifier . This data is generated internally
	 */
	private String id;

	/**
	 * glcode is the Account Code or Account Head in Accounting terms.It may be
	 * Major head,Minor head or Detailed head.It is numeric examples are
	 * 1,110,1101,1101001,2,210,21000,210010
	 * 
	 * 
	 */
	@NotNull
	@Length(max = 16, min = 1)
	private String glcode;
	/**
	 * name is the name of the account code . for example 110 glcode has the
	 * name "Tax Revenue"
	 */
	@NotNull
	@Length(max = 128, min = 5)
	private String name;
	/**
	 * accountCodePurpose is the mapped AccountCodePurpose . This mapping can
	 * happen at any level say Major,minor or detailed. When Account code is
	 * searched 1. If mapped at major code then it lists major and all other
	 * codes under that major code 2. If mapped at minor code then it list minor
	 * code and all other codes under that minor code 3. If mapped at detailed
	 * code then it lists only that code
	 */

	private AccountCodePurpose accountCodePurpose;

	/**
	 * description is the more detailed description about the account code
	 */
	@Length(max = 256)
	private String description;

	/**
	 * isActiveForPosting true will be considered for transactions. All
	 * major,minor codes will be false and only detailed code will be true .
	 * Further any account code can be disabled for transaction by making this
	 * field false
	 */
	@NotNull
	private Boolean isActiveForPosting;

	/**
	 * parentId is the id of other account code in the chart of account .Chart
	 * of account is created in tree structure. Any code can have other code as
	 * parent . All minor code will have manjor code as parent . All detailed
	 * code will have minor code as parent only leaf account code that is which
	 * is not parent for any account code will used for transactions.
	 */
	private ChartOfAccount parentId;

	/**
	 * type is a single character representation of account code type I: Income
	 * E: Expenditure L: Liability A: Asset Account code for all I start with 1
	 * Account code for all E start with 2 Account code for all L start with 3
	 * Account code for all A start with 4
	 * 
	 * 
	 */
	@NotNull
	private Character type;
	/**
	 * classification is internal to the system. This tells whether the code is
	 * Major ,Minor,Subminor or detailed. Major code classification value is 1
	 * Minor code is 2 Subminor code is 3 Detailed code is 4. Only
	 * classification 4 and is activeforposting=true will be used in
	 * transactions. Reports can be generated at any level.
	 */
	@NotNull
	private Long classification;
	/**
	 * functionRequired field specifies while transacting with this accountcode
	 * is the function is mandatory or not . For any account code this field is
	 * set to true then all transactions expect a fun=ction code to be passed
	 * along with account code
	 */
	@NotNull
	private Boolean functionRequired;
	/**
	 * budgetCheckRequired field specifies whether budgeting check required for
	 * this account code. Apart from global Budgetcheck configuration this is
	 * where glcode wise budget check decision is made.
	 * 
	 */
	@NotNull
	private Boolean budgetCheckRequired;

	/**
	 * major code is interanlly maintained for faster reporting purpose. if the
	 * glcode is major code then this value is true . all minor,subminor
	 * detailed code will have this property as false
	 */
	@Length(max = 16)
	private String majorCode;

	/**
	 * isSubledger denotes is the account code is control account / Secondary
	 * account or not . This is created and maintained internal to the system.
	 * When ever a account code made control account (subledger) this field is
	 * set to true. This field is ignore even if it is provided.
	 */

	private Boolean isSubLedger;
	
	private List<ChartOfAccountDetail> chartOfAccountDetails;

}
