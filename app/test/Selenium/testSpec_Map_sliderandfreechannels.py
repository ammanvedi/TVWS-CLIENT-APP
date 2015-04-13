import unittest
from selenium import webdriver
from selenium.webdriver import ActionChains
import time


class _BaseTest(unittest.TestCase):

	driver = None
	action_chains = None

	def setUp(self):
		print "Setting up browser environment"
		self.driver = webdriver.Chrome()
		self.driver.get("http://localhost/#/map/92/")
		from selenium.webdriver import ActionChains
		self.action_chains = ActionChains(self.driver)
		time.sleep(5)

	def test_asliderandfreechannels(self):
		print "sliderandfreechannels..."
		element = self.driver.find_element_by_class_name("container")
		ActionChains(self.driver).move_to_element_with_offset(element, 525, 368).click_and_hold().move_by_offset(-29, -2).release().perform()
		time.sleep(3)
		sidebar = self.driver.find_element_by_class_name("sidebarcontent")
		ActionChains(self.driver).move_to_element_with_offset(sidebar, 10, 10).click().perform()
		self.driver.quit()


	

if __name__ == '__main__':
    unittest.main()