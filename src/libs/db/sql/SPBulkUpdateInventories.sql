drop procedure if exists SPBulkUpdateInventories(inv_ids text, inv_vals text);
create procedure SPBulkUpdateInventories(inv_ids text,inv_vals text)
language plpgsql
as $$
declare
sqlSt text;
begin
	-- delete from inv_access
	sqlSt = 'delete from inv_access where inv_id in ('||inv_ids||')';
	EXECUTE sqlSt;
	-- update inv record
	sqlSt = 'UPDATE inventories as i SET inv_name = c.inv_name, price = c.price, weight = c.weight from (values '
	|| inv_vals || ') as c(inv_id,inv_name,price,weight) where c.inv_id=i.inv_id';
	raise INFO '%', sqlSt;
	execute sqlSt;
	commit;
end;$$

--call SPBulkUpdateInventories('19,20','(19,''Nescafe'',20,''22g''),(20,''Bru'',25,''25g'')')
--call SPBulkUpdateInventories('20,19','(7,''Cinthol'',50.0,''152g''),(8,''Apples'',150.0,''4Kg'')')
--call SPBulkUpdateInventories('19,20','(19,''Nescafe'',''22g'',20),(20,''Bru'',''25g'',25)')
--delete from inv_access where inv_id IN (23,14) and delete from inventories where inv_id IN (23,14)
