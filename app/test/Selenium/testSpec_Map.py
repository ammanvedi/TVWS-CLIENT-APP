import unittest
from selenium import webdriver
from selenium.webdriver import ActionChains
import time


class TestUI(unittest.TestCase):

	driver = None
	action_chains = None

	def setUp(self):
		print "Setting up browser environment"
		self.driver = webdriver.Chrome()
		self.driver.get("http://localhost/#/map/92/")
		from selenium.webdriver import ActionChains
		self.action_chains = ActionChains(self.driver)
		self.driver.set_window_size(1049, 680)
		time.sleep(5)
		

	def test_asliderandfreechannels(self):
		print "sliderandfreechannels..."
		element = self.driver.find_element_by_class_name("container")
		ActionChains(self.driver).move_to_element_with_offset(element, 525, 368).click_and_hold().move_by_offset(-29, -2).release().perform()
		time.sleep(3)
		#self.driver.set_window_size(1500, 960)
		sidebar = self.driver.find_element_by_id("mapsidebar")
		ActionChains(self.driver).move_to_element_with_offset(sidebar, 60, 60).click().perform()
		time.sleep(2)
		slider= self.driver.find_element_by_id("thslider")
		ActionChains(self.driver).move_to_element_with_offset(sidebar, 70, 46).click_and_hold().move_by_offset(50, 0).release().perform()
		time.sleep(2)

		self.driver.quit()

	def test_clearheatmap(self):
		print "clearheatmap..."
		element = self.driver.find_element_by_class_name("container")
		ActionChains(self.driver).move_to_element_with_offset(element, 525, 368).click_and_hold().move_by_offset(-29, -2).release().perform()
		time.sleep(3)
		btn_kill = self.driver.find_element_by_class_name("killdata")
		ActionChains(self.driver).move_to_element_with_offset(btn_kill, 5, 5).click_and_hold().release().perform()
		time.sleep(3)
		self.driver.quit()

	def test_channelselectorswork(self):
		print "channelselectorswork..."
		element = self.driver.find_element_by_class_name("container")
		ActionChains(self.driver).move_to_element_with_offset(element, 525, 368).click_and_hold().move_by_offset(-29, -2).release().perform()
		time.sleep(3)
		btn_up = self.driver.find_element_by_id("bbb_top_right")
		btn_down = self.driver.find_element_by_id("bbb_top_left")
		ActionChains(self.driver).move_to_element_with_offset(btn_up, 5, 5).click_and_hold().release().perform()
		time.sleep(3)
		ActionChains(self.driver).move_to_element_with_offset(btn_down, 5, 5).click_and_hold().release().perform()
		time.sleep(3)
		self.driver.quit()

	def test_hidesnodata(self):
		print "Running test_hidesnodata..."
		element = self.driver.find_element_by_class_name("container")
		ActionChains(self.driver).move_to_element_with_offset(element, 525, 368).click_and_hold().move_by_offset(-29, -2).release().perform()
		time.sleep(3)
		self.assertEqual('none', self.driver.find_element_by_class_name("sidebarnodata").value_of_css_property('display'))
		self.assertEqual('none', self.driver.find_element_by_class_name("graphnodata").value_of_css_property('display'))
		self.driver.quit()

	def test_togglesidebar(self):
		print "Running test_togglesidebar..."
		element = self.driver.find_element_by_id("xicon")
		ActionChains(self.driver).move_to_element_with_offset(element, 2, 2).click_and_hold().release().perform()
		time.sleep(2)
		self.assertEqual('-500px', self.driver.find_element_by_id("mapsidebar").value_of_css_property('left'))
		ActionChains(self.driver).move_to_element_with_offset(element, 2, 2).click_and_hold().release().perform()
		time.sleep(2)
		self.assertEqual('0px', self.driver.find_element_by_id("mapsidebar").value_of_css_property('left'))
		self.driver.quit()

	def test_togglebottomgraph(self):
		print "test_togglebottomgraph..."
		element = self.driver.find_element_by_class_name("hidegraph")
		ActionChains(self.driver).move_to_element_with_offset(element, 2, 2).click_and_hold().release().perform()
		time.sleep(2)
		self.assertEqual('-500px', self.driver.find_element_by_id("chart1").value_of_css_property('bottom'))
		ActionChains(self.driver).move_to_element_with_offset(element, 2, 2).click_and_hold().release().perform()
		time.sleep(2)
		self.assertEqual('120px', self.driver.find_element_by_id("chart1").value_of_css_property('bottom'))
		self.driver.quit()

	

if __name__ == '__main__':
    unittest.main()