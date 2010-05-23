all: pack

makecert:
	adt -certificate -cn QuickURLManagerDEVELOPMENT 2048-RSA devCert.pfx password

pack:
	@find . -name '.DS_Store' -exec rm '{}' \;
	@./prepareversion.sh
	@echo "Password for development certificate: password\n"
	@adt -package -storetype pkcs12 -keystore devCert.pfx QuickURLManager.air QuickURLManager-app.xml lib QuickURLManager.html style.css vendor icons/icon-* images VERSION && ./vermove.sh
	@echo "\n\nVersion for deployment: "
	@cat VERSION
	@./makeupdatefile.sh
	@mv VERSION.orig VERSION
	@mv QuickURLManager-app.xml.orig QuickURLManager-app.xml
	
clean:
	rm -rf build
	
devstart:
	adl QuickURLManager-app.xml